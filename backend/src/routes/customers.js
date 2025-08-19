import express from "express";
import oracledb from "oracledb";
import { hashPassword } from "./auth.js";
import ExpressError from "../utils/ExpressError.js";
import { wrapAsync } from "../utils/ExpressError.js";
const router = express.Router();
const configureDBObject = {
    user: "food_delivery",
    password: "pass",
    connectString: "localhost/XEPDB1"
}
router.post("/", wrapAsync(async (req, res) => {
    console.log("CREATE NEW CUSTOMER");
    const { name, email, password } = req.body;
    let database;
    const SQL_INSERT = `
        INSERT INTO CUSTOMER (name, email, password)
        VALUES (:name, :email, :hashedPassword)
        RETURNING customer_id INTO :customer_id
    `;
    const hashedPassword = await hashPassword(password);
    try {
        database = await oracledb.getConnection(configureDBObject);

        const result = await database.execute(
            SQL_INSERT,
            {
                name,
                email,
                hashedPassword,
                customer_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );
        const customer_id = result.outBinds.customer_id[0];
        req.session.customer_id = customer_id;
        return res.status(201).send(true);

    } catch (e) {
        console.error("Error creating customer:", e);
        if (e.errorNum === 1) throw new ExpressError(409, "Email already in use");
        else throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch (e) {
            console.error("Error closing DB:", e);
        }
    }
}));
router.use("/", (req, res, next)=> {
     if (!req.session.customer_id) throw new ExpressError(401, "No customer ID");
     else next();
    });
router.get("/addresses", wrapAsync(async (req, res)=> {
    console.log("GET CUSTOMER ADDESSES");
    const customer_id = req.session.customer_id;
    let database;
    let response;
    const SQL = "SELECT address_id, address1, city FROM CUSTOMERADDRESS WHERE customer_id = :customer_id";
    try {
        database = await oracledb.getConnection(configureDBObject);
        response = await database.execute(SQL, {customer_id});
         if (response.rows.length === 0) return res.status(201).send([[]]);
         else {
         console.log("Success");
         return res.json(response.rows);
         }
        } catch(e) {
        throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch(e) {
            console.log(e);
        }
    }
}));
router.delete("/addresses/:address_id", wrapAsync(async (req, res)=> {
    console.log("DELETE CUSTOMER ADDRESSES");
    const { address_id } = req.params;
    if (!address_id) return res.status(400).json({ error: "address_id is required" });
    let database;
    let response;
    const SQL = "DELETE FROM CUSTOMERADDRESS WHERE address_id = :address_id";
    try {
        database = await oracledb.getConnection(configureDBObject);
        response = await database.execute(SQL, {address_id}, {autoCommit: true});
         if (response.rowsAffected === 1) return res.status(200).json({ success: true });
        else return res.status(404).json({ error: "Address not found or already deleted" });
    } catch(e) {
        throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch(e) {
            console.log(e);
        }
    }
}));
router.post("/addresses", wrapAsync(async (req, res) => {
    console.log("CREATE NEW CUSTOMER ADDRESS");
    const { address1, address2, postal_code, city, phone_number } = req.body;
    const customer_id = req.session.customer_id;
    let database;

    const SQL_INSERT = `
        INSERT INTO CUSTOMERADDRESS (
            customer_id, address1, address2, postal_code, city, phone_number
        ) VALUES (
            :customer_id, :address1, :address2, :postal_code, :city, :phone_number
        )
        RETURNING address_id INTO :address_id
    `;

    try {
        database = await oracledb.getConnection(configureDBObject);

        const result = await database.execute(
            SQL_INSERT,
            {
                customer_id,
                address1,
                address2,
                postal_code,
                city,
                phone_number,
                address_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );
        const address_id = result.outBinds.address_id[0];
        return res.status(201).json({
            message: "Customer address added successfully",
            address_id: address_id
        });

    } catch (e) {
        throw new ExpressError(401, "Server side error");
    } finally {
        try {
            if (database) await database.close();
        } catch (e) {
            console.error("Error closing DB:", e);
        }
    }
}));
export default router;