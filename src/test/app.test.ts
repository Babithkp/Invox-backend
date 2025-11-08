import request from "supertest";
import { describe, expect, test, vi, beforeEach } from "vitest";

vi.mock("../prismaClient.ts", () => {
  return {
    default: {
      user: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      company: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      item: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      quote: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      invoice: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      payment: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      writeoff: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      customer: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      expense: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      settings: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

import app from "../index.js";
import prisma from "../prismaClient.js"; 

describe("User authentication and authorization", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe("POST /auth/register", ()=>{
        test("if email, password, and name are not provided, return 400", async()=>{
            const res = await request(app).post("/auth/register").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid name, password and role");
        });

        test("if user already exists, return 401", async()=>{
            vi.spyOn(prisma.user, "findFirst").mockResolvedValue({
                user_id: "1",
                email: "user@example.com",
                password: "securePassword123",
                role: "USER",
            });
            const res = await request(app).post("/auth/register").send({
                email: "test@example.com",
                password: "test@123",
                role: "USER",
            });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("User already exists");
        });

        test("if user data is valid, return 200 and the created user", async()=>{
            vi.spyOn(prisma.user, "findFirst").mockResolvedValue(null);
            vi.spyOn(prisma.user, "create").mockResolvedValue({
                user_id: "2",
                email: "new@example.com",
                password: "test@123",
                role: "USER",
            });
            const res = await request(app).post("/auth/register").send({
                email: "new@example.com",
                password: "test@123",
                role: "USER",
            });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                user_id: "2",
                email: "new@example.com",
                password: "test@123",
                role: "USER",
            });
        })
    })

    describe("POST /auth/login", ()=>{
        test("if email and password are not provided, return 400", async()=>{
            const res = await request(app).post("/auth/login").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid email and password");
        });

        test("if user does not exist, return 401", async()=>{
            vi.spyOn(prisma.user, "findFirst").mockResolvedValue(null);
            const res = await request(app).post("/auth/login").send({
                email: "user@example.com",
                password: "securePassword123",
            });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Invalid credentials");
        });

        test("if user data is valid, return 200 and the created user", async()=>{
            vi.spyOn(prisma.user, "findFirst").mockResolvedValue({
                user_id: "1",
                email: "user@example.com",
                password: "securePassword123",
                role: "USER",
            });
            const res = await request(app).post("/auth/login").send({
                email: "user@example.com",
                password: "securePassword123",
            });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                token: expect.any(String),
            });
        })
    })
});

describe("Company registration and management", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    describe("GET /company/{company_id}", () => {
        test("if company_id is not provided, return 400", async () => {
            const res = await request(app).get("/company/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid company_id");
        });
        test("if company does not exist, return 404", async () => {
            vi.spyOn(prisma.company, "findFirst").mockResolvedValue(null);
            const res = await request(app).get("/company/1");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Company not found");
        });
        test("if company data is valid, return 200 and the created user", async () => {
            vi.spyOn(prisma.company, "findFirst").mockResolvedValue({
                company_id: "1",
                name: "Invox Pvt Ltd",
                email: "contact@invox.com",
                password: "strongPass123",
                address: "123 Corporate Avenue, Mumbai",
                mobile_number: "9876543210",
            });
            const res = await request(app).get("/company/1");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                company_id: "1",
                name: "Invox Pvt Ltd",
                email: "contact@invox.com",
                password: "strongPass123",
                address: "123 Corporate Avenue, Mumbai",
                mobile_number: "9876543210",
            });
        });
    });

    describe("POST /company/{company_id} - Create a new company", ()=>{
        test("if company_id is not provided, return 400", async () => {
            const res = await request(app).post("/company/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid company_id");
        });
        test("if company exists, return 404", async () => {
            vi.spyOn(prisma.company, "findFirst").mockResolvedValue({
                company_id: "1",
                name: "Invox Pvt Ltd",
                email: "contact@invox.com",
                password: "strongPass123",
                address: "123 Corporate Avenue, Mumbai",
                mobile_number: "9876543210",
            });
            const res = await request(app).post("/company/1");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Company already exists");
        });
        test("create company and return 200", async () => {
        vi.spyOn(prisma.company, "findFirst").mockResolvedValue(null);
        vi.spyOn(prisma.company, "create").mockResolvedValue({
            company_id: "1",
            name: "Invox Pvt Ltd",
            email: "contact@invox.com",
            password: "strongPassword123",
            address: "123 Corporate Avenue, Mumbai",
            mobile_number: "9876543210",
        });

        const res = await request(app).post("/company/1");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Company created successfully");
        });

    });

    describe("PUT /company/{company_id} - Update an existing company", ()=>{
        test("if company_id is not provided, return 400", async () => {
            const res = await request(app).put("/company/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid company_id");
        });
        test("if company does not exist, return 404", async () => {
            vi.spyOn(prisma.company, "findFirst").mockResolvedValue(null);
            const res = await request(app).put("/company/1");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Company not found");
        });
        test("if company data is valid, return 200 and update company details", async () => {
            vi.spyOn(prisma.company, "findFirst").mockResolvedValue({
                company_id: "1",
                name: "Invox Pvt Ltd",
                email: "contact@invox.com",
                password: "strongPass123",
                address: "123 Corporate Avenue, Mumbai",
                mobile_number: "9876543210",
            });
            vi.spyOn(prisma.company, "update").mockResolvedValue({
                company_id: "1",
                name: "Invox Pvt Ltd",
                email: "contact@invox.com",
                password: "strongPass123",
                address: "123 Corporate Avenue, Mumbai",
                mobile_number: "9876543210",
            });
            const res = await request(app).put("/company/1");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Company updated successfully");
        });
    });

    describe("DELETE /company/{company_id} - Delete a company", ()=>{
        test("if company_id is not provided, return 400", async () => {
            const res = await request(app).delete("/company/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid company_id");
        });
        test("if company does not exist, return 404", async () => {
            vi.spyOn(prisma.company, "findFirst").mockResolvedValue(null);
            const res = await request(app).delete("/company/1");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Company not found");
        });
        test("if company data is valid, return 200 and delete company", async () => {
            vi.spyOn(prisma.company, "findFirst").mockResolvedValue({
                company_id: "1",
                name: "Invox Pvt Ltd",
                email: "contact@invox.com",
                password: "strongPass123",
                address: "123 Corporate Avenue, Mumbai",
                mobile_number: "9876543210",
            });
            vi.spyOn(prisma.company, "delete").mockResolvedValue({
                company_id: "1",
                name: "Invox Pvt Ltd",
                email: "contact@invox.com",
                password: "strongPass123",
                address: "123 Corporate Avenue, Mumbai",
                mobile_number: "9876543210",
            });
            const res = await request(app).delete("/company/1");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Company deleted successfully");
        });
    })
});

describe("Manage inventory and items", ()=>{
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    describe("GET /item/{item_id} - Get all items", ()=>{
        test("if item_id is not provided, return 400", async ()=>{
            const res = await request(app).get("/item/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid item_id");
        });
        test("if item does not exist, return 404", async ()=>{
            vi.spyOn(prisma.item, "findFirst").mockResolvedValue(null);
            const res = await request(app).get("/item/1");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Item not found");
        });
        test("if item data is valid, return 200 and the get item", async ()=>{
            vi.spyOn(prisma.item, "findFirst").mockResolvedValue({
                item_id: "1",
                item_name: "Item 1",
                item_price: 0,
                item_quantity: 0,
                item_description: "This is item 1",
                gst: 0,
                company_id: "1",
            });
            const res = await request(app).get("/item/1");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                item_id: "1",
                item_name: "Item 1",
                item_price: 0,
                item_quantity: 0,
                item_description: "This is item 1",
                gst: 0,
                company_id: "1",
            });
        });
    })

    describe("POST /item/{item_id} - Create a new item", ()=>{
        test("if item_id is not provided, return 400", async ()=>{
            const res = await request(app).post("/item/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid item_id");
        });
        test("if item exists, return 404", async ()=>{
            vi.spyOn(prisma.item, "findFirst").mockResolvedValue({
                item_id: "1",
                item_name: "Item 1",
                item_price: 0,
                item_quantity: 0,
                item_description: "This is item 1",
                gst: 0,
                company_id: "1",
            });
            const res = await request(app).post("/item/1");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Item already exists");
        });
        test("create item and return 200", async ()=>{
            vi.spyOn(prisma.item, "findFirst").mockResolvedValue(null);
            vi.spyOn(prisma.item, "create").mockResolvedValue({
                item_id: "1",
                item_name: "Item 1",
                item_price: 0,
                item_quantity: 0,
                item_description: "This is item 1",
                gst: 0,
                company_id: "1",
            });
            const res = await request(app).post("/item/1");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Item created successfully");
        });
    })

    describe("PUT /item/{item_id} - Update an existing item", ()=>{
        test("if item_id is not provided, return 400", async ()=>{
            const res = await request(app).put("/item/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid item_id");
        });
        test("if item does not exist, return 404", async ()=>{
            vi.spyOn(prisma.item, "findFirst").mockResolvedValue(null);
            const res = await request(app).put("/item/1");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Item not found");
        });
        test("if item data is valid, return 200 and update item details", async ()=>{
            vi.spyOn(prisma.item, "findFirst").mockResolvedValue({
                item_id: "1",
                item_name: "Item 1",
                item_price: 0,
                item_quantity: 0,
                item_description: "This is item 1",
                gst: 0,
                company_id: "1",
            });
            vi.spyOn(prisma.item, "update").mockResolvedValue({
                item_id: "1",
                item_name: "Item 1",
                item_price: 0,
                item_quantity: 0,
                item_description: "This is item 1",
                gst: 0,
                company_id: "1",
            });
            const res = await request(app).put("/item/1");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Item updated successfully");
        });
    })

    describe("DELETE /item/{item_id} - Delete a item", ()=>{
        test("if item_id is not provided, return 400", async ()=>{
            const res = await request(app).delete("/item/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid item_id");
        });
        test("if item does not exist, return 404", async ()=>{
            vi.spyOn(prisma.item, "findFirst").mockResolvedValue(null);
            const res = await request(app).delete("/item/1");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Item not found");
        });
        test("if item data is valid, return 200 and delete item", async ()=>{
            vi.spyOn(prisma.item, "findFirst").mockResolvedValue({
                item_id: "1",
                item_name: "Item 1",
                item_price: 0,
                item_quantity: 0,
                item_description: "This is item 1",
                gst: 0,
                company_id: "1",
            });
            vi.spyOn(prisma.item, "delete").mockResolvedValue({
                item_id: "1",
                item_name: "Item 1",
                item_price: 0,
                item_quantity: 0,
                item_description: "This is item 1",
                gst: 0,
                company_id: "1",
            });
            const res = await request(app).delete("/item/1");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Item deleted successfully");
        });
    })

    describe("GET /itemPage - Get paginated list of items", ()=>{
        test("if page is not provided, return 400", async ()=>{
            const res = await request(app).get("/itemPage/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Please provide valid page");
        });
        test("if page data is valid, return 200 and the get paginated items", async ()=>{
            vi.spyOn(prisma.item, "findMany").mockResolvedValue([
                {
                    item_id: "1",
                    item_name: "Item 1",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 1",
                    gst: 0,
                    company_id: "1",
                },
                {
                    item_id: "2",
                    item_name: "Item 2",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 2",
                    gst: 0,
                    company_id: "1",
                },
                {
                    item_id: "3",
                    item_name: "Item 3",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 3",
                    gst: 0,
                    company_id: "1",
                },
            ]);
            const res = await request(app).get("/itemPage/1");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                totalItems: 3,
                totalPages: 1,
                currentPage: 1,
                data:[
                {
                    item_id: "1",
                    item_name: "Item 1",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 1",
                    gst: 0,
                    company_id: "1",
                },
                {
                    item_id: "2",
                    item_name: "Item 2",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 2",
                    gst: 0,
                    company_id: "1",
                },
                {
                    item_id: "3",
                    item_name: "Item 3",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 3",
                    gst: 0,
                    company_id: "1",
                },
            ]});
        });
    })

    describe("GET /filterItem/{test} - Search items by text", ()=>{
        test("if text is not provided, return 400", async ()=>{
            const res = await request(app).get("/filterItem/").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid search text");
        });
        test("if test data is valid, return 200 and the get filtered items", async ()=>{
            vi.spyOn(prisma.item, "findMany").mockResolvedValue([
                {
                    item_id: "1",
                    item_name: "Item 1",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 1",
                    gst: 0,
                    company_id: "1",
                },
                {
                    item_id: "2",
                    item_name: "Item 2",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 2",
                    gst: 0,
                    company_id: "1",
                },
                {
                    item_id: "3",
                    item_name: "Item 3",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 3",
                    gst: 0,
                    company_id: "1",
                },
            ]);
            const res = await request(app).get("/filterItem/Item 1");
            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                {
                    item_id: "1",
                    item_name: "Item 1",
                    item_price: 0,
                    item_quantity: 0,
                    item_description: "This is item 1",
                    gst: 0,
                    company_id: "1",
                },
            ]);
        });
    })
})

describe("Quote routes (spec-based)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /quote/{quote_id} - Get all quotes (returns array)", () => {
    test("missing quote_id (GET /quote/) -> 400", async () => {
      const res = await request(app).get("/quote/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("quote not found -> 404", async () => {
      // treat findMany returning empty as not found for this route
      vi.spyOn(prisma.quote, "findMany").mockResolvedValue([]);
      const res = await request(app).get("/quote/1");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Quote not found");
    });

    test("quote(s) found -> 200 and array of quotes", async () => {
      vi.spyOn(prisma.quote, "findMany").mockResolvedValue([
        {
          quote_id: "1",
          quote_number: "Q-001",
          quote_item: "Service A",
          total_amount: 5000,
        },
        {
          quote_id: "2",
          quote_number: "Q-002",
          quote_item: "Product B",
          total_amount: 1200,
        },
      ]);

      const res = await request(app).get("/quote/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          quote_id: "1",
          quote_number: "Q-001",
          quote_item: "Service A",
          total_amount: 5000,
        },
        {
          quote_id: "2",
          quote_number: "Q-002",
          quote_item: "Product B",
          total_amount: 1200,
        },
      ]);
    });
  });

  describe("POST /quote/{quote_id} - Create a new quote", () => {
    const createBody = {
      quote_number: "Q-010",
      quote_item: "New Service",
      total_amount: 2500,
    };

    test("missing quote_id (POST /quote/) -> 400", async () => {
      const res = await request(app).post("/quote/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("quote already exists -> 409 (or 400/404 depending impl). using 404 here to keep parity", async () => {
        vi.spyOn(prisma.quote, "findFirst").mockResolvedValue({
        quote_id: "1",
        quote_number: "Q-001",
        quote_item: "Service A",
        total_amount: 500,
        });
      const res = await request(app).post("/quote/1").send(createBody);
      // your implementation might choose a different status; adjust if needed
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Quote already exists");
    });

    test("valid create -> 200 + success message", async () => {
      vi.spyOn(prisma.quote, "findFirst").mockResolvedValue(null);
      vi.spyOn(prisma.quote, "create").mockResolvedValue({
        quote_id: "10",
        ...createBody,
      });

      const res = await request(app).post("/quote/10").send(createBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Quote created successfully");
    });

    test("bad request body -> 400", async () => {
      // simulate invalid body handling if your route checks body
      const res = await request(app).post("/quote/11").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("PUT /quote/{quote_id} - Update an existing quote", () => {
    const updateBody = {
      quote_number: "Q-010-EDIT",
      quote_item: "Edited Service",
      total_amount: 3000,
    };

    test("missing quote_id (PUT /quote/) -> 400", async () => {
      const res = await request(app).put("/quote/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("quote not found -> 404", async () => {
      vi.spyOn(prisma.quote, "findFirst").mockResolvedValue(null);
      const res = await request(app).put("/quote/99").send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Quote not found");
    });

    test("valid update -> 200 + success message", async () => {
    vi.spyOn(prisma.quote, "findFirst").mockResolvedValue({
    quote_id: "1",
    quote_number: "Q-001",
    quote_item: "Service A",
    total_amount: 500,
    });
      vi.spyOn(prisma.quote, "update").mockResolvedValue({
        quote_id: "10",
        ...updateBody,
      });

      const res = await request(app).put("/quote/10").send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Quote updated successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).put("/quote/10").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("DELETE /quote/{quote_id} - Delete a quote", () => {
    test("missing quote_id (DELETE /quote/) -> 400", async () => {
      const res = await request(app).delete("/quote/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("quote not found -> 404", async () => {
      vi.spyOn(prisma.quote, "findFirst").mockResolvedValue(null);
      const res = await request(app).delete("/quote/77");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Quote not found");
    });

    test("successful delete -> 200 + success message", async () => {
    vi.spyOn(prisma.quote, "findFirst").mockResolvedValue({
    quote_id: "1",
    quote_number: "Q-001",
    quote_item: "Service A",
    total_amount: 500,
    });
    vi.spyOn(prisma.quote, "findFirst").mockResolvedValue({
    quote_id: "1",
    quote_number: "Q-001",
    quote_item: "Service A",
    total_amount: 500,
    });

      const res = await request(app).delete("/quote/10");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Quote deleted successfully");
    });
  });

  describe("GET /quotePage - Paginated list of quotes", () => {
    test("missing page/limit -> 400", async () => {
      const res = await request(app).get("/quotePage").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad parameters");
    });

    test("valid page/limit -> 200 + paginated payload", async () => {
      vi.spyOn(prisma.quote, "findMany").mockResolvedValue([
        {
          quote_id: "1",
          quote_number: "Q-001",
          quote_item: "Service A",
          total_amount: 500,
        },
        {
          quote_id: "2",
          quote_number: "Q-002",
          quote_item: "Service B",
          total_amount: 1500,
        },
      ]);

      const res = await request(app).get("/quotePage").query({ page: 1, limit: 10 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        data: [
          {
            quote_id: "1",
            quote_number: "Q-001",
            quote_item: "Service A",
            total_amount: 500,
          },
          {
            quote_id: "2",
            quote_number: "Q-002",
            quote_item: "Service B",
            total_amount: 1500,
          },
        ],
      });
    });
  });

  describe("GET /filterQuote/{text} - Search quotes by text", () => {
    test("missing text -> 400", async () => {
      const res = await request(app).get("/filterQuote/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid search text");
    });

    test("valid text -> 200 + filtered results", async () => {
      vi.spyOn(prisma.quote, "findMany").mockResolvedValue([
        {
          quote_id: "5",
          quote_number: "Q-005",
          quote_item: "SearchMatch",
          total_amount: 900,
        },
      ]);

      const res = await request(app).get("/filterQuote/SearchMatch");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          quote_id: "5",
          quote_number: "Q-005",
          quote_item: "SearchMatch",
          total_amount: 900,
        },
      ]);
    });
  });
});

describe("Invoice routes - CRUD, pagination and search", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /invoice/{invoice_id} - Get all invoices (returns array)", () => {
    test("missing invoice_id (GET /invoice/) -> 400", async () => {
      const res = await request(app).get("/invoice/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("invoice not found -> 404", async () => {
      vi.spyOn(prisma.invoice, "findMany").mockResolvedValue([]);
      const res = await request(app).get("/invoice/1");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Invoice not found");
    });

    test("invoice(s) found -> 200 and array of invoices", async () => {
      vi.spyOn(prisma.invoice, "findMany").mockResolvedValue([
        {
          invoice_id: "1",
          invoice_number: "INV-001",
          invoice_item: "Service A",
          payment_method: "CARD",
          total_amount: 5000,
        },
        {
          invoice_id: "2",
          invoice_number: "INV-002",
          invoice_item: "Product B",
          payment_method: "CASH",
          total_amount: 1200,
        },
      ]);

      const res = await request(app).get("/invoice/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          invoice_id: "1",
          invoice_number: "INV-001",
          invoice_item: "Service A",
          payment_method: "CARD",
          total_amount: 5000,
        },
        {
          invoice_id: "2",
          invoice_number: "INV-002",
          invoice_item: "Product B",
          payment_method: "CASH",
          total_amount: 1200,
        },
      ]);
    });
  });

  describe("POST /invoice/{invoice_id} - Create a new invoice", () => {
    const createBody = {
      invoice_number: "INV-010",
      invoice_item: "New Service",
      payment_method: "CARD",
      total_amount: 2500,
    };

    test("missing invoice_id (POST /invoice/) -> 400", async () => {
      const res = await request(app).post("/invoice/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("invoice already exists -> 404", async () => {
      vi.spyOn(prisma.invoice, "findFirst").mockResolvedValue({
        invoice_id: "1",
        invoice_number: "INV-001",
        invoice_item: "Existing",
        payment_method: "CARD",
        total_amount: 100,
      });
      const res = await request(app).post("/invoice/1").send(createBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Invoice already exists");
    });

    test("valid create -> 200 + success message", async () => {
      vi.spyOn(prisma.invoice, "findFirst").mockResolvedValue(null);
      vi.spyOn(prisma.invoice, "create").mockResolvedValue({
        invoice_id: "10",
        ...createBody,
      });

      const res = await request(app).post("/invoice/10").send(createBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Invoice created successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).post("/invoice/11").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("PUT /invoice/{invoice_id} - Update an existing invoice", () => {
    const updateBody = {
      invoice_number: "INV-010-EDIT",
      invoice_item: "Edited Service",
      payment_method: "UPI",
      total_amount: 3000,
    };

    test("missing invoice_id (PUT /invoice/) -> 400", async () => {
      const res = await request(app).put("/invoice/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("invoice not found -> 404", async () => {
      vi.spyOn(prisma.invoice, "findFirst").mockResolvedValue(null);
      const res = await request(app).put("/invoice/99").send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Invoice not found");
    });

    test("valid update -> 200 + success message", async () => {
      vi.spyOn(prisma.invoice, "findFirst").mockResolvedValue({
        invoice_id: "10",
        invoice_number: "INV-010",
        invoice_item: "Old item",
        payment_method: "CARD",
        total_amount: 2000,
      });
      vi.spyOn(prisma.invoice, "update").mockResolvedValue({
        invoice_id: "10",
        ...updateBody,
      });

      const res = await request(app).put("/invoice/10").send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Invoice updated successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).put("/invoice/10").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("DELETE /invoice/{invoice_id} - Delete an invoice", () => {
    test("missing invoice_id (DELETE /invoice/) -> 400", async () => {
      const res = await request(app).delete("/invoice/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("invoice not found -> 404", async () => {
      vi.spyOn(prisma.invoice, "findFirst").mockResolvedValue(null);
      const res = await request(app).delete("/invoice/77");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Invoice not found");
    });

    test("successful delete -> 200 + success message", async () => {
      vi.spyOn(prisma.invoice, "findFirst").mockResolvedValue({
        invoice_id: "10",
        invoice_number: "INV-010",
        invoice_item: "Some item",
        payment_method: "CARD",
        total_amount: 1000,
      });
      vi.spyOn(prisma.invoice, "delete").mockResolvedValue({
        invoice_id: "10",
        invoice_number: "INV-010",
        invoice_item: "Some item",
        payment_method: "CARD",
        total_amount: 1000,
      });

      const res = await request(app).delete("/invoice/10");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Invoice deleted successfully");
    });
  });

  describe("GET /invoicePage - Paginated list of invoices", () => {
    test("missing page/limit -> 400", async () => {
      const res = await request(app).get("/invoicePage").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad parameters");
    });

    test("valid page/limit -> 200 + paginated payload", async () => {
      vi.spyOn(prisma.invoice, "findMany").mockResolvedValue([
        {
          invoice_id: "1",
          invoice_number: "INV-001",
          invoice_item: "Service A",
          payment_method: "CARD",
          total_amount: 500,
        },
        {
          invoice_id: "2",
          invoice_number: "INV-002",
          invoice_item: "Service B",
          payment_method: "CASH",
          total_amount: 1500,
        },
      ]);
      // mock count fallback if used
      vi.spyOn(prisma.invoice, "count").mockResolvedValue(2);

      const res = await request(app).get("/invoicePage").query({ page: 1, limit: 10 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        data: [
          {
            invoice_id: "1",
            invoice_number: "INV-001",
            invoice_item: "Service A",
            payment_method: "CARD",
            total_amount: 500,
          },
          {
            invoice_id: "2",
            invoice_number: "INV-002",
            invoice_item: "Service B",
            payment_method: "CASH",
            total_amount: 1500,
          },
        ],
      });
    });
  });

  describe("GET /filterInvoice/{text} - Search invoices by text", () => {
    test("missing text -> 400", async () => {
      const res = await request(app).get("/filterInvoice/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid search text");
    });

    test("valid text -> 200 + filtered results", async () => {
      vi.spyOn(prisma.invoice, "findMany").mockResolvedValue([
        {
          invoice_id: "5",
          invoice_number: "INV-005",
          invoice_item: "SearchMatch",
          payment_method: "CARD",
          total_amount: 900,
        },
      ]);

      const res = await request(app).get("/filterInvoice/SearchMatch");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          invoice_id: "5",
          invoice_number: "INV-005",
          invoice_item: "SearchMatch",
          payment_method: "CARD",
          total_amount: 900,
        },
      ]);
    });
  });
});

describe("Payment_Record routes - CRUD, pagination and search", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /payment/{payment_id} - Get all payment records (returns array)", () => {
    test("missing payment_id (GET /payment/) -> 400", async () => {
      const res = await request(app).get("/payment/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("payment not found -> 404", async () => {
      vi.spyOn(prisma.payment, "findMany").mockResolvedValue([]);
      const res = await request(app).get("/payment/1");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Payment not found");
    });

    test("payment(s) found -> 200 and array of payments", async () => {
      vi.spyOn(prisma.payment, "findMany").mockResolvedValue([
        {
          payment_id: "1",
          invoice_id: "10",
          amount: 500,
          paid_at: new Date(),
        },
        {
          payment_id: "2",
          invoice_id: "11",
          amount: 1200,
          paid_at: new Date(),
        },
      ]);

      const res = await request(app).get("/payment/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          payment_id: "1",
          invoice_id: "10",
          amount: 500,
          paid_at: expect.any(String),
        },
        {
          payment_id: "2",
          invoice_id: "11",
          amount: 1200,
          paid_at: expect.any(String),
        },
      ]);
    });
  });

  describe("POST /payment/{payment_id} - Record a payment", () => {
    const createBody = { invoice_id: "10", amount: 700 };

    test("missing payment_id (POST /payment/) -> 400", async () => {
      const res = await request(app).post("/payment/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("payment already exists -> 404", async () => {
      vi.spyOn(prisma.payment, "findFirst").mockResolvedValue({
        payment_id: "1",
        invoice_id: "10",
        amount: 700,
        paid_at: new Date(),
      });
      const res = await request(app).post("/payment/1").send(createBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Payment already exists");
    });

    test("valid create -> 200 + success message", async () => {
      vi.spyOn(prisma.payment, "findFirst").mockResolvedValue(null);
      vi.spyOn(prisma.payment, "create").mockResolvedValue({
        payment_id: "100",
        invoice_id: createBody.invoice_id,
        amount: createBody.amount,
        paid_at: new Date(),
      });

      const res = await request(app).post("/payment/100").send(createBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Payment recorded successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).post("/payment/101").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("PUT /payment/{payment_id} - Update a payment record", () => {
    const updateBody = { invoice_id: "10", amount: 900 };

    test("missing payment_id (PUT /payment/) -> 400", async () => {
      const res = await request(app).put("/payment/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("payment not found -> 404", async () => {
      vi.spyOn(prisma.payment, "findFirst").mockResolvedValue(null);
      const res = await request(app).put("/payment/99").send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Payment not found");
    });

    test("valid update -> 200 + success message", async () => {
      vi.spyOn(prisma.payment, "findFirst").mockResolvedValue({
        payment_id: "50",
        invoice_id: "20",
        amount: 300,
        paid_at: new Date(),
      });
      vi.spyOn(prisma.payment, "update").mockResolvedValue({
        payment_id: "50",
        ...updateBody,
        paid_at: new Date(),
      });

      const res = await request(app).put("/payment/50").send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Payment updated successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).put("/payment/50").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("DELETE /payment/{payment_id} - Delete a payment record", () => {
    test("missing payment_id (DELETE /payment/) -> 400", async () => {
      const res = await request(app).delete("/payment/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("payment not found -> 404", async () => {
      vi.spyOn(prisma.payment, "findFirst").mockResolvedValue(null);
      const res = await request(app).delete("/payment/77");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Payment not found");
    });

    test("successful delete -> 200 + success message", async () => {
      vi.spyOn(prisma.payment, "findFirst").mockResolvedValue({
        payment_id: "10",
        invoice_id: "5",
        amount: 250,
        paid_at: new Date(),
      });
      vi.spyOn(prisma.payment, "delete").mockResolvedValue({
        payment_id: "10",
        invoice_id: "5",
        amount: 250,
        paid_at: new Date(),
      });

      const res = await request(app).delete("/payment/10");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Payment deleted successfully");
    });
  });

  describe("GET /paymentPage - Paginated list of payments", () => {
    test("missing page/limit -> 400", async () => {
      const res = await request(app).get("/paymentPage").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad parameters");
    });

    test("valid page/limit -> 200 + paginated payload", async () => {
      vi.spyOn(prisma.payment, "findMany").mockResolvedValue([
        {
          payment_id: "1",
          invoice_id: "10",
          amount: 500,
          paid_at: new Date(),
        },
        {
          payment_id: "2",
          invoice_id: "11",
          amount: 1500,
          paid_at: new Date(),
        },
      ]);
      vi.spyOn(prisma.payment, "count").mockResolvedValue(2);

      const res = await request(app).get("/paymentPage").query({ page: 1, limit: 10 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        data: [
          {
            payment_id: "1",
            invoice_id: "10",
            amount: 500,
            paid_at: expect.any(String),
          },
          {
            payment_id: "2",
            invoice_id: "11",
            amount: 1500,
            paid_at: expect.any(String),
          },
        ],
      });
    });
  });

  describe("GET /filterPayment/{text} - Search payments by text", () => {
    test("missing text -> 400", async () => {
      const res = await request(app).get("/filterPayment/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid search text");
    });

    test("valid text -> 200 + filtered results", async () => {
      vi.spyOn(prisma.payment, "findMany").mockResolvedValue([
        {
          payment_id: "5",
          invoice_id: "20",
          amount: 900,
          paid_at: new Date(),
        },
      ]);

      const res = await request(app).get("/filterPayment/20");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          payment_id: "5",
          invoice_id: "20",
          amount: 900,
          paid_at: expect.any(String),
        },
      ]);
    });
  });
});

describe("Write-off routes - CRUD", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /writeoff/{write_off_id} - Get all write-offs (returns array)", () => {
    test("missing write_off_id (GET /writeoff/) -> 400", async () => {
      const res = await request(app).get("/writeoff/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("write-off not found -> 404", async () => {
      vi.spyOn(prisma.writeoff, "findMany").mockResolvedValue([]);
      const res = await request(app).get("/writeoff/1");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Write-off not found");
    });

    test("write-off(s) found -> 200 and array of write-offs", async () => {
      vi.spyOn(prisma.writeoff, "findMany").mockResolvedValue([
        {
          write_off_id: "1",
          invoice_id: "10",
          amount: 150,
          reason: "Bad debt",
        },
        {
          write_off_id: "2",
          invoice_id: "11",
          amount: 200,
          reason: "Customer bankruptcy",
        },
      ]);

      const res = await request(app).get("/writeoff/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          write_off_id: "1",
          invoice_id: "10",
          amount: 150,
          reason: "Bad debt",
        },
        {
          write_off_id: "2",
          invoice_id: "11",
          amount: 200,
          reason: "Customer bankruptcy",
        },
      ]);
    });
  });

  describe("POST /writeoff/{write_off_id} - Record a write-off", () => {
    const createBody = { invoice_id: "10", amount: 150, reason: "Bad debt" };

    test("missing write_off_id (POST /writeoff/) -> 400", async () => {
      const res = await request(app).post("/writeoff/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("write-off already exists -> 404", async () => {
      vi.spyOn(prisma.writeoff, "findFirst").mockResolvedValue({
        write_off_id: "1",
        invoice_id: "10",
        amount: 150,
        reason: "Bad debt",
      });

      const res = await request(app).post("/writeoff/1").send(createBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Write-off already exists");
    });

    test("valid create -> 200 + success message", async () => {
      vi.spyOn(prisma.writeoff, "findFirst").mockResolvedValue(null);
      vi.spyOn(prisma.writeoff, "create").mockResolvedValue({
        write_off_id: "10",
        ...createBody,
      });

      const res = await request(app).post("/writeoff/10").send(createBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Write-off recorded successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).post("/writeoff/11").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("PUT /writeoff/{write_off_id} - Update a write-off record", () => {
    const updateBody = { invoice_id: "10", amount: 200, reason: "Updated reason" };

    test("missing write_off_id (PUT /writeoff/) -> 400", async () => {
      const res = await request(app).put("/writeoff/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("write-off not found -> 404", async () => {
      vi.spyOn(prisma.writeoff, "findFirst").mockResolvedValue(null);
      const res = await request(app).put("/writeoff/99").send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Write-off not found");
    });

    test("valid update -> 200 + success message", async () => {
      vi.spyOn(prisma.writeoff, "findFirst").mockResolvedValue({
        write_off_id: "50",
        invoice_id: "20",
        amount: 100,
        reason: "Old reason",
      });
      vi.spyOn(prisma.writeoff, "update").mockResolvedValue({
        write_off_id: "50",
        ...updateBody,
      });

      const res = await request(app).put("/writeoff/50").send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Write-off updated successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).put("/writeoff/50").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("DELETE /writeoff/{write_off_id} - Delete a write-off record", () => {
    test("missing write_off_id (DELETE /writeoff/) -> 400", async () => {
      const res = await request(app).delete("/writeoff/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("write-off not found -> 404", async () => {
      vi.spyOn(prisma.writeoff, "findFirst").mockResolvedValue(null);
      const res = await request(app).delete("/writeoff/77");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Write-off not found");
    });

    test("successful delete -> 200 + success message", async () => {
      vi.spyOn(prisma.writeoff, "findFirst").mockResolvedValue({
        write_off_id: "10",
        invoice_id: "5",
        amount: 250,
        reason: "Some reason",
      });
      vi.spyOn(prisma.writeoff, "delete").mockResolvedValue({
        write_off_id: "10",
        invoice_id: "5",
        amount: 250,
        reason: "Some reason",
      });

      const res = await request(app).delete("/writeoff/10");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Write-off deleted successfully");
    });
  });
});

describe("Customer routes - CRUD, pagination and search", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /customer/{customer_id} - Get all customers (returns array)", () => {
    test("missing customer_id (GET /customer/) -> 400", async () => {
      const res = await request(app).get("/customer/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("customer not found -> 404", async () => {
      vi.spyOn(prisma.customer, "findMany").mockResolvedValue([]);
      const res = await request(app).get("/customer/1");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Customer not found");
    });

    test("customer(s) found -> 200 and array of customers", async () => {
      vi.spyOn(prisma.customer, "findMany").mockResolvedValue([
        {
          customer_id: "1",
          name: "Alice",
          email: "alice@example.com",
          address: "123 Lane",
          mobile_number: "9876543210",
          customer_gst: "GSTIN1234",
        },
        {
          customer_id: "2",
          name: "Bob",
          email: "bob@example.com",
          address: "456 Road",
          mobile_number: "9123456780",
          customer_gst: "GSTIN5678",
        },
      ]);

      const res = await request(app).get("/customer/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          customer_id: "1",
          name: "Alice",
          email: "alice@example.com",
          address: "123 Lane",
          mobile_number: "9876543210",
          customer_gst: "GSTIN1234",
        },
        {
          customer_id: "2",
          name: "Bob",
          email: "bob@example.com",
          address: "456 Road",
          mobile_number: "9123456780",
          customer_gst: "GSTIN5678",
        },
      ]);
    });
  });

  describe("POST /customer/{customer_id} - Create a new customer", () => {
    const createBody = {
      name: "Charlie",
      email: "charlie@example.com",
      address: "789 Blvd",
      mobile_number: "9000000000",
      customer_gst: "GSTIN9999",
    };

    test("missing customer_id (POST /customer/) -> 400", async () => {
      const res = await request(app).post("/customer/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("customer already exists -> 404", async () => {
      vi.spyOn(prisma.customer, "findFirst").mockResolvedValue({
        customer_id: "1",
        ...createBody,
      });
      const res = await request(app).post("/customer/1").send(createBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Customer already exists");
    });

    test("valid create -> 200 + success message", async () => {
      vi.spyOn(prisma.customer, "findFirst").mockResolvedValue(null);
      vi.spyOn(prisma.customer, "create").mockResolvedValue({
        customer_id: "10",
        ...createBody,
      });

      const res = await request(app).post("/customer/10").send(createBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Customer created successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).post("/customer/11").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("PUT /customer/{customer_id} - Update customer details", () => {
    const updateBody = {
      name: "Charlie Edited",
      email: "charlie2@example.com",
      address: "789 New Blvd",
      mobile_number: "9000000001",
      customer_gst: "GSTIN0000",
    };

    test("missing customer_id (PUT /customer/) -> 400", async () => {
      const res = await request(app).put("/customer/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("customer not found -> 404", async () => {
      vi.spyOn(prisma.customer, "findFirst").mockResolvedValue(null);
      const res = await request(app).put("/customer/99").send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Customer not found");
    });

    test("valid update -> 200 + success message", async () => {
      vi.spyOn(prisma.customer, "findFirst").mockResolvedValue({
        customer_id: "10",
        name: "Old Name",
        email: "old@example.com",
        address: "old addr",
        mobile_number: "9000000002",
        customer_gst: "GOLD123",
      });
      vi.spyOn(prisma.customer, "update").mockResolvedValue({
        customer_id: "10",
        ...updateBody,
      });

      const res = await request(app).put("/customer/10").send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Customer updated successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).put("/customer/10").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("DELETE /customer/{customer_id} - Delete a customer", () => {
    test("missing customer_id (DELETE /customer/) -> 400", async () => {
      const res = await request(app).delete("/customer/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("customer not found -> 404", async () => {
      vi.spyOn(prisma.customer, "findFirst").mockResolvedValue(null);
      const res = await request(app).delete("/customer/77");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Customer not found");
    });

    test("successful delete -> 200 + success message", async () => {
      vi.spyOn(prisma.customer, "findFirst").mockResolvedValue({
        customer_id: "10",
        name: "ToDelete",
        email: "del@example.com",
        address: "addr",
        mobile_number: "9000000003",
        customer_gst: "GSTDEL",
      });
      vi.spyOn(prisma.customer, "delete").mockResolvedValue({
        customer_id: "10",
        name: "ToDelete",
        email: "del@example.com",
        address: "addr",
        mobile_number: "9000000003",
        customer_gst: "GSTDEL",
      });

      const res = await request(app).delete("/customer/10");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Customer deleted successfully");
    });
  });

  describe("GET /customerPage - Paginated list of customers", () => {
    test("missing page/limit -> 400", async () => {
      const res = await request(app).get("/customerPage").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad parameters");
    });

    test("valid page/limit -> 200 + paginated payload", async () => {
      vi.spyOn(prisma.customer, "findMany").mockResolvedValue([
        {
          customer_id: "1",
          name: "Alice",
          email: "alice@example.com",
          address: "123 Lane",
          mobile_number: "9876543210",
          customer_gst: "GSTIN1234",
        },
        {
          customer_id: "2",
          name: "Bob",
          email: "bob@example.com",
          address: "456 Road",
          mobile_number: "9123456780",
          customer_gst: "GSTIN5678",
        },
      ]);
      vi.spyOn(prisma.customer, "count").mockResolvedValue(2);

      const res = await request(app).get("/customerPage").query({ page: 1, limit: 10 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        data: [
          {
            customer_id: "1",
            name: "Alice",
            email: "alice@example.com",
            address: "123 Lane",
            mobile_number: "9876543210",
            customer_gst: "GSTIN1234",
          },
          {
            customer_id: "2",
            name: "Bob",
            email: "bob@example.com",
            address: "456 Road",
            mobile_number: "9123456780",
            customer_gst: "GSTIN5678",
          },
        ],
      });
    });
  });

  describe("GET /filterCustomer/{text} - Search customers by text", () => {
    test("missing text -> 400", async () => {
      const res = await request(app).get("/filterCustomer/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid search text");
    });

    test("valid text -> 200 + filtered results", async () => {
      vi.spyOn(prisma.customer, "findMany").mockResolvedValue([
        {
          customer_id: "5",
          name: "SearchMatch",
          email: "match@example.com",
          address: "Some address",
          mobile_number: "9000000004",
          customer_gst: "GSTMATCH",
        },
      ]);

      const res = await request(app).get("/filterCustomer/SearchMatch");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          customer_id: "5",
          name: "SearchMatch",
          email: "match@example.com",
          address: "Some address",
          mobile_number: "9000000004",
          customer_gst: "GSTMATCH",
        },
      ]);
    });
  });
});

describe("Expense routes - CRUD, pagination and search", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /expense/{expense_id} - Get all expenses (returns array)", () => {
    test("missing expense_id (GET /expense/) -> 400", async () => {
      const res = await request(app).get("/expense/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("expense not found -> 404", async () => {
      vi.spyOn(prisma.expense, "findMany").mockResolvedValue([]);
      const res = await request(app).get("/expense/1");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Expense not found");
    });

    test("expense(s) found -> 200 and array of expenses", async () => {
      vi.spyOn(prisma.expense, "findMany").mockResolvedValue([
        {
          expense_id: "1",
          expense_name: "Office Supplies",
          amount: 250,
          expense_date: "2025-11-08",
          created_at: new Date(),
        },
        {
          expense_id: "2",
          expense_name: "Travel",
          amount: 1200,
          expense_date: "2025-11-07",
          created_at: new Date(),
        },
      ]);

      const res = await request(app).get("/expense/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          expense_id: "1",
          expense_name: "Office Supplies",
          amount: 250,
          expense_date: "2025-11-08",
          created_at: expect.any(String),
        },
        {
          expense_id: "2",
          expense_name: "Travel",
          amount: 1200,
          expense_date: "2025-11-07",
          created_at: expect.any(String),
        },
      ]);
    });
  });

  describe("POST /expense/{expense_id} - Create a new expense", () => {
    const createBody = {
      expense_name: "Stationery",
      amount: 150,
      expense_date: "2025-11-08",
    };

    test("missing expense_id (POST /expense/) -> 400", async () => {
      const res = await request(app).post("/expense/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("expense already exists -> 404", async () => {
      vi.spyOn(prisma.expense, "findFirst").mockResolvedValue({
        expense_id: "1",
        ...createBody,
        created_at: new Date(),
      });
      const res = await request(app).post("/expense/1").send(createBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Expense already exists");
    });

    test("valid create -> 200 + success message", async () => {
      vi.spyOn(prisma.expense, "findFirst").mockResolvedValue(null);
      vi.spyOn(prisma.expense, "create").mockResolvedValue({
        expense_id: "10",
        ...createBody,
        created_at: new Date(),
      });

      const res = await request(app).post("/expense/10").send(createBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Expense created successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).post("/expense/11").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("PUT /expense/{expense_id} - Update an expense record", () => {
    const updateBody = {
      expense_name: "Stationery Updated",
      amount: 180,
      expense_date: "2025-11-08",
    };

    test("missing expense_id (PUT /expense/) -> 400", async () => {
      const res = await request(app).put("/expense/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("expense not found -> 404", async () => {
      vi.spyOn(prisma.expense, "findFirst").mockResolvedValue(null);
      const res = await request(app).put("/expense/99").send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Expense not found");
    });

    test("valid update -> 200 + success message", async () => {
      vi.spyOn(prisma.expense, "findFirst").mockResolvedValue({
        expense_id: "50",
        expense_name: "Old Expense",
        amount: 100,
        expense_date: "2025-11-01",
        created_at: new Date(),
      });
      vi.spyOn(prisma.expense, "update").mockResolvedValue({
        expense_id: "50",
        ...updateBody,
        created_at: new Date(),
      });

      const res = await request(app).put("/expense/50").send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Expense updated successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).put("/expense/50").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("DELETE /expense/{expense_id} - Delete an expense record", () => {
    test("missing expense_id (DELETE /expense/) -> 400", async () => {
      const res = await request(app).delete("/expense/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("expense not found -> 404", async () => {
      vi.spyOn(prisma.expense, "findFirst").mockResolvedValue(null);
      const res = await request(app).delete("/expense/77");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Expense not found");
    });

    test("successful delete -> 200 + success message", async () => {
      vi.spyOn(prisma.expense, "findFirst").mockResolvedValue({
        expense_id: "10",
        expense_name: "ToDelete",
        amount: 250,
        expense_date: "2025-11-08",
        created_at: new Date(),
      });
      vi.spyOn(prisma.expense, "delete").mockResolvedValue({
        expense_id: "10",
        expense_name: "ToDelete",
        amount: 250,
        expense_date: "2025-11-08",
        created_at: new Date(),
      });

      const res = await request(app).delete("/expense/10");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Expense deleted successfully");
    });
  });

  describe("GET /expensePage - Paginated list of expenses", () => {
    test("missing page/limit -> 400", async () => {
      const res = await request(app).get("/expensePage").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad parameters");
    });

    test("valid page/limit -> 200 + paginated payload", async () => {
      vi.spyOn(prisma.expense, "findMany").mockResolvedValue([
        {
          expense_id: "1",
          expense_name: "Office Supplies",
          amount: 250,
          expense_date: "2025-11-08",
          created_at: new Date(),
        },
        {
          expense_id: "2",
          expense_name: "Travel",
          amount: 1200,
          expense_date: "2025-11-07",
          created_at: new Date(),
        },
      ]);
      vi.spyOn(prisma.expense, "count").mockResolvedValue(2);

      const res = await request(app).get("/expensePage").query({ page: 1, limit: 10 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        data: [
          {
            expense_id: "1",
            expense_name: "Office Supplies",
            amount: 250,
            expense_date: "2025-11-08",
            created_at: expect.any(String),
          },
          {
            expense_id: "2",
            expense_name: "Travel",
            amount: 1200,
            expense_date: "2025-11-07",
            created_at: expect.any(String),
          },
        ],
      });
    });
  });

  describe("GET /filterExpense/{text} - Search expenses by text", () => {
    test("missing text -> 400", async () => {
      const res = await request(app).get("/filterExpense/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid search text");
    });

    test("valid text -> 200 + filtered results", async () => {
      vi.spyOn(prisma.expense, "findMany").mockResolvedValue([
        {
          expense_id: "5",
          expense_name: "SearchMatch",
          amount: 900,
          expense_date: "2025-11-08",
          created_at: new Date(),
        },
      ]);

      const res = await request(app).get("/filterExpense/SearchMatch");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          expense_id: "5",
          expense_name: "SearchMatch",
          amount: 900,
          expense_date: "2025-11-08",
          created_at: expect.any(String),
        },
      ]);
    });
  });
});


describe("Settings (company) routes - CRUD & fetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /settings/company - List company settings", () => {
    test("returns list of settings -> 200", async () => {
      vi.spyOn(prisma.settings, "findMany").mockResolvedValue([
        {
          company_id: "1",
          company_name: "Acme Ltd",
          company_address: "123 Acme St",
          company_gst: "GSTIN123",
          account_details: {
            ifsc_code: "IFSC001",
            bank_name: "Bank A",
            branch_address: "Branch A",
          },
        },
      ]);

      const res = await request(app).get("/settings/company");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          company_id: "1",
          company_name: "Acme Ltd",
          company_address: "123 Acme St",
          company_gst: "GSTIN123",
          account_details: {
            ifsc_code: "IFSC001",
            bank_name: "Bank A",
            branch_address: "Branch A",
          },
        },
      ]);
    });

    test("empty list -> 200 and empty array", async () => {
      vi.spyOn(prisma.settings, "findMany").mockResolvedValue([]);
      const res = await request(app).get("/settings/company");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("POST /settings/company - Create or update settings", () => {
    const body = {
      company_id: "10",
      company_name: "New Co",
      company_address: "10 New St",
      company_gst: "GSTNEW10",
      account_details: { ifsc_code: "IFSC10", bank_name: "Bank X", branch_address: "Branch X" },
    };

    test("missing/invalid body -> 400", async () => {
      const res = await request(app).post("/settings/company").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("valid create/update -> 200 + success message", async () => {
      // Simulate upsert-like behavior: first try findFirst, then create/update as needed.
      vi.spyOn(prisma.settings, "findFirst").mockResolvedValue(null);
      vi.spyOn(prisma.settings, "create").mockResolvedValue({ ...body });

      const res = await request(app).post("/settings/company").send(body);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Company settings created/updated successfully");
    });
  });

  describe("GET /settings/company/:company_id - Get settings for a company", () => {
    test("missing company_id (GET /settings/company/) -> 400", async () => {
      // calling the base path with trailing slash (no id) should be treated as bad input for this specific route in tests
      const res = await request(app).get("/settings/company/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("settings not found -> 404", async () => {
      vi.spyOn(prisma.settings, "findFirst").mockResolvedValue(null);
      const res = await request(app).get("/settings/company/77");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Settings not found for company");
    });

    test("settings found -> 200 + settings object", async () => {
      const record = {
        company_id: "20",
        company_name: "Found Co",
        company_address: "20 Found St",
        company_gst: "GSTFOUND",
        account_details: { ifsc_code: "IFSC20", bank_name: "Bank Y", branch_address: "Branch Y" },
      };
      vi.spyOn(prisma.settings, "findFirst").mockResolvedValue(record);
      const res = await request(app).get("/settings/company/20");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(record);
    });
  });

  describe("PUT /settings/company/:company_id - Update settings", () => {
    const updateBody = {
      company_id: "20",
      company_name: "Found Co Edited",
      company_address: "20 Found St Edited",
      company_gst: "GSTFOUND2",
      account_details: { ifsc_code: "IFSC20", bank_name: "Bank Y", branch_address: "Branch Y" },
    };

    test("missing company_id (PUT /settings/company/) -> 400", async () => {
      const res = await request(app).put("/settings/company/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("settings not found -> 404", async () => {
      vi.spyOn(prisma.settings, "findFirst").mockResolvedValue(null);
      const res = await request(app).put("/settings/company/99").send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Settings not found for company");
    });

    test("valid update -> 200 + success message", async () => {
      vi.spyOn(prisma.settings, "findFirst").mockResolvedValue({
        company_id: "20",
        company_name: "Found Co",
        company_address: "20 Found St",
        company_gst: "GSTFOUND",
        account_details: { ifsc_code: "IFSC20", bank_name: "Bank Y", branch_address: "Branch Y" },
      });
      vi.spyOn(prisma.settings, "update").mockResolvedValue({ ...updateBody });
      const res = await request(app).put("/settings/company/20").send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Company settings updated successfully");
    });

    test("bad request body -> 400", async () => {
      const res = await request(app).put("/settings/company/20").send({}); // missing fields
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });
  });

  describe("DELETE /settings/company/:company_id - Delete settings for a company", () => {
    test("missing company_id (DELETE /settings/company/) -> 400", async () => {
      const res = await request(app).delete("/settings/company/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid request or bad input");
    });

    test("settings not found -> 404", async () => {
      vi.spyOn(prisma.settings, "findFirst").mockResolvedValue(null);
      const res = await request(app).delete("/settings/company/77");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Settings not found for company");
    });

    test("successful delete -> 200 + success message", async () => {
      vi.spyOn(prisma.settings, "findFirst").mockResolvedValue({
        company_id: "30",
        company_name: "ToDelete Co",
        company_address: "Addr",
        company_gst: "GSTDEL",
        account_details: { ifsc_code: "IFSC30", bank_name: "Bank Z", branch_address: "Branch Z" },
      });
      vi.spyOn(prisma.settings, "delete").mockResolvedValue({
        company_id: "30",
        company_name: "ToDelete Co",
        company_address: "Addr",
        company_gst: "GSTDEL",
        account_details: { ifsc_code: "IFSC30", bank_name: "Bank Z", branch_address: "Branch Z" },
      });

      const res = await request(app).delete("/settings/company/30");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Company settings deleted successfully");
    });
  });
});

//hello