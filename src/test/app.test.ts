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
      }
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