import { Column, TableComponent, TableComponentModification } from "../../model/design/table";

interface TableBuilderOutput {
  columns: Column[];
}

/**
 * A class for easily and quickly building configuration data for tables found in /src/components/degign/tables
 */
export class TableBuilder {
  private columns: Column[] = [];

  /**
   * Adds a column configuration for a component.
   * @param header The header title at the top of the table
   * @param component The component to render. It will be passed the row data
   */
  public addComponentColumn(
    header: string,
    component: TableComponent
  ): TableBuilder {
    const newColumn: Column = {header, component};
    this.columns.push(newColumn);

    return this;
  }

  /**
   * Adds a column utilizing data
   * @param header The header title
   * @param key The key of the data to print
   */
  public addDataColumn(header: string, key: string, modification?: TableComponentModification): TableBuilder {
    const newColumn: Column = {header, key, modification};
    this.columns.push(newColumn);

    return this;
  }

  /**
   * Creates column configuration for creating an incrementing column
   * @param header The header title of the increment column
   */
  public addIncrementColumn(header: string): TableBuilder {
    const newColumn: Column = {header, increment: true};
    this.columns.push(newColumn);

    return this;
  }

  /**
   * Returns the configuration from this class
   */
  public renderConfig(): TableBuilderOutput  {
    return { columns: this.columns };
  }
}
