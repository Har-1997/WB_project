import axios from "axios";
import knex from "../postgres/knex.js";
import { updateGoogleSheet } from "./googleSheetService.js";
import { fixDecimalType } from "#utils/functions.js";

interface Tariff {
    date: string;
    warehouse_name: string;
    delivery_storage_coefficient: string;
    delivery_base_cost: number;
    delivery_liter_cost: number;
    storage_base_cost: number;
    storage_liter_cost: number;
    valid_until_date: string | null;
    next_box_date: string | null;
}

export async function getAndUpdateTariffs() {
    try {
        const { WB_API_TOKEN, WB_API_URL } = process.env;
        const date = new Date().toISOString().split("T")[0];

        // Fetch data from the Wildberries API
        const response = await axios.get(`${WB_API_URL}?date=${date}`, {
            headers: { Authorization: `Bearer ${WB_API_TOKEN}` },
        });

        const allData = response.data.response.data;

        // Insert or update the tariffs data
        for (const item of allData.warehouseList) {
            const tariff: Tariff = {
                date: date,
                warehouse_name: item.warehouseName,
                delivery_storage_coefficient: item.boxDeliveryAndStorageExpr,
                delivery_base_cost: fixDecimalType(item.boxDeliveryBase),
                delivery_liter_cost: fixDecimalType(item.boxDeliveryLiter),
                storage_base_cost: fixDecimalType(item.boxStorageBase),
                storage_liter_cost: fixDecimalType(item.boxStorageLiter),
                valid_until_date: allData.dtTillMax || null,
                next_box_date: allData.dtNextBox || null,
            };

            await knex("tariffs").insert(tariff).onConflict(["warehouse_name", "date"]).merge();
        }
        console.log('Data successfuly added in the DB');

        //Run Google sheet logic
        await updateGoogleSheet(date);

    } catch (error) {
        console.error("Error fetching data from Wildberries API:", error);
    }
}