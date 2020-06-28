/* eslint-disable @typescript-eslint/no-inferrable-types */

type ValidateOnState = "all" | "create" | "edit";

export default class Model {
  
  public _data: {} = {};

  private _errors: {} = {}; 
  private _fields: {} = {};
  private _validationChecks: any = [];

  constructor() {
    // _generateFieldList()
  }

  public getErrors() {
    return this._errors;
  }

  public validate(): boolean {
    // For each key in 
    return true;
  }

  private validatePresence(
    error: string = "The [key] field is required.",
    field?: string,
    fields?: string[],
    onState?: ValidateOnState
  ): Model {
    // Do nothing if no fields are given
    if (field === undefined && fields === undefined) {
      return this;
    }

    // Put everything into an array
    if (field !== undefined) {
      fields = [field];
    }

    this._validationChecks.push({
      fields,
      onState,
      validator: this.$validatePresence,
    })

    return this;
  }

  private validateString(
    error: string = "The [key] field is not valid",
    field?: string,
    fields?: string[],
    minimum?: number,
    maximum?: number,
    required?: boolean,
    onState?: ValidateOnState
  ): Model {


    return this;
  }

  private $validatePresence(
    field: string,
  ) {
    if (field in this._data)
    return false;
  }
}