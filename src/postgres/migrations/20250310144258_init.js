/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.string("date", 10).notNullable();
        table.string("warehouse_name").notNullable();
        table.decimal("delivery_storage_coefficient").notNullable();
        table.decimal("delivery_base_cost", 10, 2);
        table.decimal("delivery_liter_cost", 10, 2);
        table.decimal("storage_base_cost", 10, 2);
        table.decimal("storage_liter_cost", 10, 2);
        table.string("valid_until_date", 10);
        table.string("next_box_date", 10);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        table.unique(["warehouse_name", "date"]);
    });

    // Add a trigger for automatically updating the `updated_at` column
    await knex.raw(`
        CREATE OR REPLACE FUNCTION update_timestamp() 
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_tariff_updated_at
        BEFORE UPDATE ON tariffs
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    `);
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("tariffs");
}
