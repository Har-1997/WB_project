import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import knex from "../postgres/knex.js";

const { CLIENT_EMAIL, PRIVATE_KEY="", SHEET_ID="" } = process.env;

// Authentication Google
const auth = new JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function updateGoogleSheet(date: string) {
  try {
      // Initialize the document
      const doc = new GoogleSpreadsheet(SHEET_ID, auth);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];

      // Get data from DB
      const tariffs = await knex("tariffs")
        .where("date", date) 
        .orderBy("delivery_storage_coefficient", "asc");

      // Convert DB rows into an array of arrays
      const rows = tariffs.map((tariff) => [
          tariff.date,
          tariff.warehouse_name,
          tariff.delivery_storage_coefficient,
          +tariff.delivery_base_cost,
          +tariff.delivery_liter_cost,
          +tariff.storage_base_cost,
          +tariff.storage_liter_cost,
          tariff.valid_until_date,
          tariff.next_box_date,
      ]);

      // Insert data into Google Sheets
      await sheet.clear(); // Clears all
      await sheet.setHeaderRow([
          "Date",
          "Warehouse Name",
          "Delivery Storage Coefficient",
          "Delivery Base Cost",
          "Delivery Liter Cost",
          "Storage Base Cost",
          "Storage Liter Cost",
          "Valid Until Date",
          "Next Box Date",
      ]); // Add header
      await sheet.addRows(rows); // Fill our data

      console.log("Google Sheet updated successfully!");
  } catch (error) {
      console.error("Error updating Google Sheet:", error);
  }
}