
export function asyncHandler(fn) {
    return (req,res,next) => {
        fn().catch(err =>{
            res.status(500).json({message:err.message,stack:stack.err})
        })
    }
}