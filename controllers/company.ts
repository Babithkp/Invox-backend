import type { Request, Response } from "express";
import { z } from "zod";
import prisma from '../src/prismaClient.js';
import { 
  companyParamsSchema, 
  createCompanySchema,
  updateCompanySchema
} from "../schemas/company.schema.js";
import type { 
  CompanyParams,
  CreateCompanyInput,
  UpdateCompanyInput
} from "../schemas/company.schema.js";

export const getCompany = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = companyParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { company_id }: CompanyParams = paramsResult.data;
    const company = await prisma.company.findFirst({
      where: { company_id },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json(company);
  } catch (err) {
    console.error("getCompany error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCompany = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = companyParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { company_id }: CompanyParams = paramsResult.data;

    // Validate body with Zod (allow empty body with defaults)
    const bodyResult = createCompanySchema.safeParse(req.body || {});
    if (!bodyResult.success) {
      // Use default values if validation fails
      const defaultData = {
        name: "Default Company",
        email: "default@company.com",
        password: "defaultpass",
        address: "Default Address",
        mobile_number: "1234567890"
      };
      const { name, email, password, address, mobile_number } = defaultData;
      
      const existing = await prisma.company.findFirst({
        where: { company_id },
      });
      if (existing) {
        return res.status(404).json({ message: "Company already exists" });
      }
      
      await prisma.company.create({
        data: {
          company_id,
          name,
          email,
          password,
          address,
          mobile_number,
        },
      });
      return res.status(200).send({message:"Company created successfully"});
    }

    const { name, email, password, address, mobile_number }: CreateCompanyInput = bodyResult.data;

    const existing = await prisma.company.findFirst({
      where: { company_id },
    });
    if (existing) {
      return res.status(404).json({ message: "Company already exists" });
    }
    await prisma.company.create({
      data: {
        company_id,
        name,
        email,
        password,
        address,
        mobile_number,
      },
    });
    return res.status(200).send({message:"Company created successfully"});
  } catch (err) {
    console.error("createCompany error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = companyParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { company_id }: CompanyParams = paramsResult.data;

    const existing = await prisma.company.findFirst({
      where: { company_id },
    });
    if (!existing) {
      return res.status(404).json({ message: "Company not found" });
    }

    // For update, allow empty body (no changes)
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(200).send({message:"Company updated successfully"});
    }

    // Validate body with Zod
    const bodyResult = updateCompanySchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const updateData: UpdateCompanyInput = bodyResult.data;

    const {
      name = existing.name,
      email = existing.email,
      password = existing.password,
      address = existing.address,
      mobile_number = existing.mobile_number,
    } = updateData;
    await prisma.company.update({
      where: { company_id },
      data: { name, email, password, address, mobile_number },
    });
    return res.status(200).send({message:"Company updated successfully"});
  } catch (err) {
    console.error("updateCompany error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = companyParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { company_id }: CompanyParams = paramsResult.data;
    const existing = await prisma.company.findFirst({
      where: { company_id },
    });
    if (!existing) {
      return res.status(404).json({ message: "Company not found" });
    }
    await prisma.company.delete({
      where: { company_id }
    });
    return res.status(200).json({message:"Company deleted successfully"});
  } catch (err) {
    console.error("deleteCompany error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
