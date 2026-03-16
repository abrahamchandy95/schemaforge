import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { buildSystemPrompt } from '@/lib/tigergraph/prompt/system';
import { buildUserPrompt } from '@/lib/tigergraph/prompt/user';
import type { PromptInput } from '@/lib/tigergraph/prompt/types';
import { agentResultSchema } from '@/lib/tigergraph/agent/schema';
import type { AgentResult } from '@/lib/tigergraph/agent/types';
import { toSchemaDraft } from '@/lib/tigergraph/agent/to-draft';
import { validateAgentResult } from '@/lib/tigergraph/agent/validate';

const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: 'GEMINI_API_KEY is missing from the server environment.',
        },
        { status: 500 },
      );
    }

    const input = (await request.json()) as PromptInput;

    if (!input.ready) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Prompt input is not ready.',
          issues: input.issues,
        },
        { status: 400 },
      );
    }

    const system = buildSystemPrompt(input);
    const user = buildUserPrompt(input);

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model,
      contents: user,
      config: {
        systemInstruction: system,
        responseMimeType: 'application/json',
        responseJsonSchema: agentResultSchema,
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      return NextResponse.json(
        {
          ok: false,
          error: 'The model returned an empty response.',
        },
        { status: 502 },
      );
    }

    let result: AgentResult;

    try {
      result = parseAgentResult(JSON.parse(text));
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          error: 'The model returned invalid structured JSON.',
          raw: text,
          detail: error instanceof Error ? error.message : 'Unknown parse error.',
        },
        { status: 502 },
      );
    }

    const validationIssues = validateAgentResult(result, input);

    if (validationIssues.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'The model returned a schema draft that failed validation.',
          validationIssues,
          result,
          prompts: {
            system,
            user,
          },
        },
        { status: 422 },
      );
    }

    const draft = toSchemaDraft(result, input.mapping.selected);

    return NextResponse.json({
      ok: true,
      model,
      result,
      draft,
      prompts: {
        system,
        user,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate schema draft.',
      },
      { status: 500 },
    );
  }
}

function parseAgentResult(value: unknown): AgentResult {
  if (!isObject(value)) {
    throw new Error('Top-level JSON value must be an object.');
  }

  const title = asString(value.title, 'title');
  const summary = asString(value.summary, 'summary');
  const vertices = asArray(value.vertices, 'vertices').map(parseVertex);
  const edges = asArray(value.edges, 'edges').map(parseEdge);
  const attributes = asArray(value.attributes, 'attributes').map(parseAttribute);
  const assumptions = asStringArray(value.assumptions, 'assumptions');
  const notes = asStringArray(value.notes, 'notes');

  return {
    title,
    summary,
    vertices,
    edges,
    attributes,
    assumptions,
    notes,
  };
}

function parseVertex(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Each vertex must be an object.');
  }

  return {
    name: asString(value.name, 'vertex.name'),
    description: asString(value.description, 'vertex.description'),
    sourceKeys: asStringArray(value.sourceKeys, 'vertex.sourceKeys'),
  };
}

function parseEdge(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Each edge must be an object.');
  }

  return {
    name: asString(value.name, 'edge.name'),
    from: asString(value.from, 'edge.from'),
    to: asString(value.to, 'edge.to'),
    description: asString(value.description, 'edge.description'),
    sourceKeys: asStringArray(value.sourceKeys, 'edge.sourceKeys'),
  };
}

function parseAttribute(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Each attribute must be an object.');
  }

  const ownerType = asString(value.ownerType, 'attribute.ownerType');
  if (ownerType !== 'vertex' && ownerType !== 'edge') {
    throw new Error('attribute.ownerType must be "vertex" or "edge".');
  }

  return {
    name: asString(value.name, 'attribute.name'),
    ownerType,
    ownerName: asString(value.ownerName, 'attribute.ownerName'),
    dataType: asString(value.dataType, 'attribute.dataType'),
    sourceKey: asString(value.sourceKey, 'attribute.sourceKey'),
  };
}

function asString(value: unknown, path: string) {
  if (typeof value !== 'string') {
    throw new Error(`${path} must be a string.`);
  }

  return value;
}

function asArray(value: unknown, path: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${path} must be an array.`);
  }

  return value;
}

function asStringArray(value: unknown, path: string) {
  const array = asArray(value, path);

  for (const item of array) {
    if (typeof item !== 'string') {
      throw new Error(`${path} must contain only strings.`);
    }
  }

  return array;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
