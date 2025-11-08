import prisma from '../src/prismaClient.js'

export const getCompany = async (req: any, res: any) => {
  try {
    const {company_id} = req.params;
    if (!company_id) {
      return res.status(400).json({ message: "Please provide valid company_id" });
    }
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

export const createCompany = async (req: any, res: any) => {
  try {
    const company_id = req.params.company_id;
    if (!company_id) {
      return res.status(400).json({ message: "Please provide valid company_id" });
    }
    const existing = await prisma.company.findFirst({
      where: { company_id },
    });
    if (existing) {
      return res.status(404).json({ message: "Company already exists" });
    }
    const {name, email, password, address, mobile_number} = req.body || {};
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

export const updateCompany = async (req: any, res: any) => {
  try {
    const company_id = req.params.company_id;
    if (!company_id) {
      return res.status(400).json({ message: "Please provide valid company_id" });
    }
    const existing = await prisma.company.findFirst({
      where: { company_id },
    });
    if (!existing) {
      return res.status(404).json({ message: "Company not found" });
    }
    const {
      name = existing.name,
      email = existing.email,
      password = existing.password,
      address = existing.address,
      mobile_number = existing.mobile_number,
    } = req.body || {};
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

export const deleteCompany = async (req: any, res: any) => {
  try {
    const company_id = req.params.company_id;
    if (!company_id) {
      return res.status(400).json({ message: "Please provide valid company_id" });
    }
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
