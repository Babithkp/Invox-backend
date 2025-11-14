import type { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import prisma from "../src/prismaClient";
import { 
  invoiceParamsSchema, 
  pageQuerySchema,
  filterParamsSchema,
  createInvoiceSchema,
  updateInvoiceSchema
} from "../schemas/invoice.schema";
import type { 
  InvoiceParams,
  PageQuery,
  FilterParams,
  CreateInvoiceInput,
  UpdateInvoiceInput
} from "../schemas/invoice.schema";

type Invoice = {
  invoice_id: string;
  invoice_number: string;
  invoice_item: string;
  payment_method: string;
  total_amount: number;
};

export const getInvoice = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = invoiceParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { invoice_id }: InvoiceParams = paramsResult.data;

    const invoices = await prisma.invoice.findMany({
      where: { invoice_id },
    });

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json(invoices as Invoice[]);
  } catch (err) {
    console.error("GET /invoice/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = invoiceParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    // Validate body with Zod
    const bodyResult = createInvoiceSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { invoice_id }: InvoiceParams = paramsResult.data;
    const { invoice_number, invoice_item, payment_method, total_amount }: CreateInvoiceInput = bodyResult.data;

    const existing = await prisma.invoice.findFirst({ where: { invoice_id } });

    if (existing) {
      return res.status(404).json({ message: "Invoice already exists" });
    }

    await prisma.invoice.create({
      data: {
        invoice_id,
        invoice_number,
        invoice_item,
        payment_method,
        total_amount,
      },
    });

    return res.status(200).json({ message: "Invoice created successfully" });
  } catch (err) {
    console.error("POST /invoice/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = invoiceParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    // For update, allow empty body
    const bodyResult = updateInvoiceSchema.safeParse(req.body || {});
    if (!bodyResult.success && Object.keys(req.body || {}).length > 0) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { invoice_id }: InvoiceParams = paramsResult.data;
    const { invoice_number, invoice_item, payment_method, total_amount }: UpdateInvoiceInput = bodyResult.data;

    const existing = await prisma.invoice.findFirst({ where: { invoice_id } });

    if (!existing) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Filter out undefined values for update
    const updateData: any = {};
    if (invoice_number !== undefined) updateData.invoice_number = invoice_number;
    if (invoice_item !== undefined) updateData.invoice_item = invoice_item;
    if (payment_method !== undefined) updateData.payment_method = payment_method;
    if (total_amount !== undefined) updateData.total_amount = total_amount;

    await prisma.invoice.update({
      where: { invoice_id },
      data: updateData,
    });

    return res.status(200).json({ message: "Invoice updated successfully" });
  } catch (err) {
    console.error("PUT /invoice/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = invoiceParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { invoice_id }: InvoiceParams = paramsResult.data;

    const existing = await prisma.invoice.findFirst({ where: { invoice_id } });

    if (!existing) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await prisma.invoice.delete({ where: { invoice_id } });

    return res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    console.error("DELETE /invoice/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getInvoicePage = async (req: Request, res: Response) => {
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
      // @ts-ignore - mocked prisma in tests might not implement count()
      totalItems = await prisma.invoice.count();
    } catch {
      const maybeAll = await prisma.invoice.findMany();
      totalItems = maybeAll ? maybeAll.length : 0;
    }

    const data = await prisma.invoice.findMany({
      skip,
      take: limit,
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return res.status(200).json({
      totalItems,
      totalPages,
      currentPage: page,
      data: data as Invoice[],
    });
  } catch (err) {
    console.error("GET /invoicePage error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const filterInvoice: RequestHandler<{ text?: string }, Invoice[] | { message: string }, any, any> =
  async (req, res) => {
    try {
      const text = req.params.text;
      if (typeof text !== "string" || text.trim() === "") {
        return res.status(400).json({ message: "Invalid search text" });
      }

      const results = await prisma.invoice.findMany({
        where: {
          OR: [
            { invoice_number: { contains: text } },
            { invoice_item: { contains: text } },
            { payment_method: { contains: text } },
          ],
        },
      });

      return res.status(200).json(results as Invoice[]);
    } catch (err) {
      console.error("GET /filterInvoice/:text error", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
