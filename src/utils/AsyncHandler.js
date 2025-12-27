const AsyncHandler = (requstHandler)=>
      (req,res,next)=>{
        Promise.resolve(requstHandler(req,res,next)).catch((err)=> next(err))
      }


export {AsyncHandler}