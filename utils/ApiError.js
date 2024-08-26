class ApiError extends Error {
    constructor(
        statusCode,
        massage = "something Went wrong",
        error = [],
        stack = ""
    ) {
        super(massage)
        this.statusCode = statusCode
        this.data = null
        this.massage = massage
        this.success = false
        this.error = error

        if (stack) {
            this.stack = stack
        } else {
            error.captureStackTrace(this, this.constructor)
        }


    }
}

export { ApiError }