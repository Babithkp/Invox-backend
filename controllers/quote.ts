import type { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import prisma from "../src/prismaClient.js";
import { 
  quoteParamsSchema, 
  pageQuerySchema, 
  filterParamsSchema,
  createQuoteSchema,
  updateQuoteSchema
} from "../schemas/quote.schema.js";
import type { 
  QuoteParams,
  PageQuery,
  FilterParams,
  CreateQuoteInput,
  UpdateQuoteInput
} from "../schemas/quote.schema.js";

type Quote = {
  quote_id: string;
  quote_number: string;
  quote_item: string;
  total_amount: number;
};

export const getQuote = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = quoteParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { quote_id }: QuoteParams = paramsResult.data;

    const quotes = await prisma.quote.findMany({
      where: { quote_id },
    });

    if (!quotes || quotes.length === 0) {
      return res.status(404).json({ message: "Quote not found" });
    }

    return res.status(200).json(quotes as Quote[]);
  } catch (err) {
    console.error("GET /quote/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createQuote = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = quoteParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    // Validate body with Zod
    const bodyResult = createQuoteSchema.safeParse(req.body);
    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { quote_id }: QuoteParams = paramsResult.data;
    const { quote_number, quote_item, total_amount }: CreateQuoteInput = bodyResult.data;

    const existing = await prisma.quote.findFirst({ where: { quote_id } });

    if (existing) {
      // kept 404 to match your tests
      return res.status(404).json({ message: "Quote already exists" });
    }

    await prisma.quote.create({
      data: {
        quote_id,
        quote_number,
        quote_item,
        total_amount,
      },
    });

    return res.status(200).json({ message: "Quote created successfully" });
  } catch (err) {
    console.error("POST /quote/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuote = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = quoteParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    // Validate body with Zod
    const bodyResult = updateQuoteSchema.safeParse(req.body);
    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { quote_id }: QuoteParams = paramsResult.data;
    const { quote_number, quote_item, total_amount }: UpdateQuoteInput = bodyResult.data;

    const existing = await prisma.quote.findFirst({ where: { quote_id } });

    if (!existing) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Filter out undefined values for update
    const updateData: any = {};
    if (quote_number !== undefined) updateData.quote_number = quote_number;
    if (quote_item !== undefined) updateData.quote_item = quote_item;
    if (total_amount !== undefined) updateData.total_amount = total_amount;

    await prisma.quote.update({
      where: { quote_id },
      data: updateData,
    });

    return res.status(200).json({ message: "Quote updated successfully" });
  } catch (err) {
    console.error("PUT /quote/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteQuote = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = quoteParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { quote_id }: QuoteParams = paramsResult.data;

    const existing = await prisma.quote.findFirst({ where: { quote_id } });

    if (!existing) {
      return res.status(404).json({ message: "Quote not found" });
    }

    await prisma.quote.delete({ where: { quote_id } });

    return res.status(200).json({ message: "Quote deleted successfully" });
  } catch (err) {
    console.error("DELETE /quote/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuotePage = async (req: Request, res: Response) => {
  try {
    const pageRaw = (req.query.page ?? (req.params && (req.params as any).page)) as string | undefined;
    const limitRaw = (req.query.limit ?? undefined) as string | undefined;

    // Validate query parameters with Zod
    const queryResult = pageQuerySchema.safeParse({ page: pageRaw, limit: limitRaw });
    if (!queryResult.success) {
      const errors = queryResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { page: pageStr, limit: limitStr }: PageQuery = queryResult.data;
    const page = Number.parseInt(pageStr, 10);
    const limit = Number.parseInt(limitStr, 10);

    const skip = (page - 1) * limit;

    let totalItems = 0;
    try {
      // @ts-ignore - count may be mocked in tests
      totalItems = await prisma.quote.count();
    } catch {
      const maybeAll = await prisma.quote.findMany();
      totalItems = maybeAll ? maybeAll.length : 0;
    }

    const data = await prisma.quote.findMany({
      skip,
      take: limit,
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return res.status(200).json({
      totalItems,
      totalPages,
      currentPage: page,
      data: data as Quote[],
    });
  } catch (err) {
    console.error("GET /quotePage error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const filterQuote: RequestHandler<{ text?: string }, Quote[] | { message: string }, any, any> =
  async (req, res) => {
    try {
      const text = req.params.text;
      if (typeof text !== "string" || text.trim() === "") {
        return res.status(400).json({ message: "Invalid search text" });
      }

      const results = await prisma.quote.findMany({
        where: {
          OR: [
            { quote_number: { contains: text } },
            { quote_item: { contains: text } },
          ],
        },
      });

      return res.status(200).json(results as Quote[]);
    } catch (err) {
      console.error("GET /filterQuote/:text error", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
