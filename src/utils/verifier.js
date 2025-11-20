function is_type(input, expected_type){
    if (typeof input !== expected_type){
        return false
    }
    return true
}

module.exports = is_type;