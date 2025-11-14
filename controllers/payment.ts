import type { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import prisma from "../src/prismaClient";
import { 
  paymentParamsSchema, 
  pageQuerySchema, 
  filterParamsSchema,
  createPaymentSchema,
  updatePaymentSchema
} from "../schemas/payment.schema";
import type { 
  PaymentParams,
  PageQuery,
  FilterParams,
  CreatePaymentInput,
  UpdatePaymentInput
} from "../schemas/payment.schema";

type Payment = {
  payment_id: string;
  invoice_id: string;
  amount: number;
  paid_at: Date;
};

export const getPayment = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = paymentParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { payment_id }: PaymentParams = paramsResult.data;

    const payments = await prisma.payment.findMany({
      where: { payment_id },
    });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json(payments as Payment[]);
  } catch (err) {
    console.error("GET /payment/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = paymentParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    // Validate body with Zod
    const bodyResult = createPaymentSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { payment_id }: PaymentParams = paramsResult.data;
    const { invoice_id, amount }: CreatePaymentInput = bodyResult.data;

    const existing = await prisma.payment.findFirst({ where: { payment_id } });

    if (existing) {
      return res.status(404).json({ message: "Payment already exists" });
    }

    await prisma.payment.create({
      data: {
        payment_id,
        invoice_id,
        amount,
        paid_at: new Date(),
      },
    });

    return res.status(200).json({ message: "Payment recorded successfully" });
  } catch (err) {
    console.error("POST /payment/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = paymentParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    // For update, allow empty body
    const bodyResult = updatePaymentSchema.safeParse(req.body || {});
    if (!bodyResult.success && Object.keys(req.body || {}).length > 0) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { payment_id }: PaymentParams = paramsResult.data;
    const { invoice_id, amount }: UpdatePaymentInput = bodyResult.data;

    const existing = await prisma.payment.findFirst({ where: { payment_id } });

    if (!existing) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Filter out undefined values for update
    const updateData: any = {};
    if (invoice_id !== undefined) updateData.invoice_id = invoice_id;
    if (amount !== undefined) updateData.amount = amount;

    await prisma.payment.update({
      where: { payment_id },
      data: updateData,
    });

    return res.status(200).json({ message: "Payment updated successfully" });
  } catch (err) {
    console.error("PUT /payment/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = paymentParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { payment_id }: PaymentParams = paramsResult.data;

    const existing = await prisma.payment.findFirst({ where: { payment_id } });

    if (!existing) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await prisma.payment.delete({ where: { payment_id } });

    return res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("DELETE /payment/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPaymentPage = async (req: Request, res: Response) => {
  try {
    const pageRaw = (req.query.page ?? (req.params && (req.params as any).page)) as string | undefined;
    const limitRaw = (req.query.limit ?? undefined) as string | undefined;

    // Validate query parameters with Zod
    const queryResult = pageQuerySchema.safeParse({ page: pageRaw, limit: limitRaw });
    if (!queryResult.success) {
      return res.status(400).json({ message: "Invalid request or bad parameters" });
    }

    const { page: pageStr, limit: limitStr }: PageQuery = queryResult.data;
    const page = Number.parseInt(pageStr, 10);
    const limit = Number.parseInt(limitStr, 10);

    const skip = (page - 1) * limit;

    let totalItems = 0;
    try {
      totalItems = await prisma.payment.count();
    } catch {
      const maybeAll = await prisma.payment.findMany();
      totalItems = maybeAll ? maybeAll.length : 0;
    }

    const data = await prisma.payment.findMany({
      skip,
      take: limit,
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return res.status(200).json({
      totalItems,
      totalPages,
      currentPage: page,
      data: data as Payment[],
    });
  } catch (err) {
    console.error("GET /paymentPage error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const filterPayment: RequestHandler<{ text?: string }, Payment[] | { message: string }, any, any> =
  async (req, res) => {
    try {
      const text = req.params.text;
      if (typeof text !== "string" || text.trim() === "") {
        return res.status(400).json({ message: "Invalid search text" });
      }

      const results = await prisma.payment.findMany({
        where: {
          OR: [
            { invoice_id: { contains: text } },
            { payment_id: { contains: text } },
          ],
        },
      });

      return res.status(200).json(results as Payment[]);
    } catch (err) {
      console.error("GET /filterPayment/:text error", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };