
class ApiError extends Error {
    stack= ""  
    constructor(
        statuscode,
        message ="Something went Wrong",
        error = [], 
        stack = ""
    ){
      
      super(message);
      this.name = "ValidationError";
      this.statuscode =statuscode
      this.data = null 
      this.error = error
    
      if(stack) {
          this.stack  =stack  
      }else{
           Error.captureStackTrace(this,this.constructor)
      }
    }
}

export {ApiError}