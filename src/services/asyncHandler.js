
export function asyncHandler(fn) {
    return (req,res,next) => {
        fn(req,res,next).catch(err =>{
            // res.status(500).json({message:err.message,stack:stack.err})
            next(new Error(err.message,{cause:500}))
        })
    }
}

export const globalError = (err,req,res,next) =>{
    if(err){
        if(process.env.ENV == "DEV"){
            res.status(err['cause']).json({
                message:err.message,
                stack:err.stack,
                status:err['cause']
            })
        }else{
            res.status(err['cause']).json({
                message:err.message,
                status:err['cause']
            })
        }
      
    }
}