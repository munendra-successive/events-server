import StatusCodes from "./StatusCodes";
class SystemResponse {
  static success(message: any, data?: any, datalength?: number) {
    return {
      success: true,
      data: data ?? null,
      datalength: datalength ?? null,
      message: message ?? "SUCCESS",
      status: StatusCodes.SUCCESS,
    };
  }
  static badRequest(message: any, error?: any) {
    return SystemResponse.getErrorResponse(
      message,
      error,
      StatusCodes.BAD_REQUEST
    );
  }

  static invalidData(message: string) {
    return {
      success: false,
      message: message ?? "Invalid data",
      status: StatusCodes.UNPROCESSABLE_ENTITY,
    };
  }
  static notFound(message: any) {
    return {
      success: false,
      message: message ?? "Data not found",
      status: StatusCodes.NOT_FOUND,
    };
  }

  static unAuthenticated(message:string){
    return{
      success:false,
      message:message ?? "Unauthorized",
      status:StatusCodes.FORBIDDEN
    }
  }
  static getErrorResponse(message?: any, error?: any, code?: any) {
    return {
      success: false,
      error: error ?? null,
      message: message ?? "Internal Server achhha Error",
      status: code ?? StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}

export default SystemResponse;
