const AsyncHandler = (requstHandler)=>
      (req,res,next)=>{
        Promise.resolve(requstHandler(req,res,next)).catch((err)=>{ 
          console.log("eror hannleer" ,err)
          return next(err)
          }
        )
      }


export {AsyncHandler}