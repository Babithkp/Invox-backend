// controllers/invoice.controller.ts
import type { RequestHandler } from "express";
import prisma from "../src/prismaClient.js";
import type { ParsedQs } from "qs";

const isEmpty = (v: unknown) => v === undefined || v === null || v === "";

type Invoice = {
  invoice_id: string;
  invoice_number: string;
  invoice_item: string;
  payment_method: string;
  total_amount: number;
};

export const getInvoice: RequestHandler<{ invoice_id?: string }, Invoice[] | { message: string }, any, any> =
  async (req, res) => {
    try {
      const invoice_id = req.params.invoice_id;
      if (typeof invoice_id !== "string" || invoice_id.trim() === "") {
        return res.status(400).json({ message: "Invalid request or bad input" });
      }

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

export const createInvoice: RequestHandler<
  { invoice_id?: string },
  { message: string },
  { invoice_number?: string; invoice_item?: string; payment_method?: string; total_amount?: number },
  any
> = async (req, res) => {
  try {
    const invoice_id = req.params.invoice_id;
    if (typeof invoice_id !== "string" || invoice_id.trim() === "") {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { invoice_number, invoice_item, payment_method, total_amount } = req.body ?? {};

    if (isEmpty(invoice_number) || isEmpty(invoice_item) || isEmpty(payment_method) || total_amount === undefined) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

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

export const updateInvoice: RequestHandler<
  { invoice_id?: string },
  { message: string },
  { invoice_number?: string; invoice_item?: string; payment_method?: string; total_amount?: number },
  any
> = async (req, res) => {
  try {
    const invoice_id = req.params.invoice_id;
    if (typeof invoice_id !== "string" || invoice_id.trim() === "") {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { invoice_number, invoice_item, payment_method, total_amount } = req.body ?? {};

    if (isEmpty(invoice_number) || isEmpty(invoice_item) || isEmpty(payment_method) || total_amount === undefined) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const existing = await prisma.invoice.findFirst({ where: { invoice_id } });

    if (!existing) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await prisma.invoice.update({
      where: { invoice_id },
      data: {
        invoice_number,
        invoice_item,
        payment_method,
        total_amount,
      },
    });

    return res.status(200).json({ message: "Invoice updated successfully" });
  } catch (err) {
    console.error("PUT /invoice/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteInvoice: RequestHandler<{ invoice_id?: string }, { message: string }, any, any> =
  async (req, res) => {
    try {
      const invoice_id = req.params.invoice_id;
      if (typeof invoice_id !== "string" || invoice_id.trim() === "") {
        return res.status(400).json({ message: "Invalid request or bad input" });
      }

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

export const getInvoicePage: RequestHandler<
  { page?: string },
  { totalItems: number; totalPages: number; currentPage: number; data: Invoice[] } | { message: string },
  any,
  ParsedQs
> = async (req, res) => {
  try {
    const pageRaw = (req.query.page ?? (req.params && (req.params as any).page)) as string | undefined;
    const limitRaw = (req.query.limit ?? undefined) as string | undefined;

    if (typeof pageRaw !== "string" || typeof limitRaw !== "string") {
      return res.status(400).json({ message: "Invalid request or bad parameters" });
    }

    const page = Number.parseInt(pageRaw, 10);
    const limit = Number.parseInt(limitRaw, 10);

    if (!Number.isInteger(page) || !Number.isInteger(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({ message: "Invalid request or bad parameters" });
    }

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
