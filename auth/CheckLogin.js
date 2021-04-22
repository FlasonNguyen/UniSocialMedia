const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    //Gửi token cùng body sẽ bất tiện vì kèm theo nhiều nội dung khác từ body
    //Sử dụng Bearer Token trong đó token sẽ được đính kèm trong header tên là authorization
    let authorization  = req.header('Authorization')
    if(!authorization) {
        return res.status(401).json({code: 101, message: 'Please login first (token not in header)'})
    }
    //Sau khi lấy nội dung header chúng ta cắt ra 2 phần dựa vào khoảng trắng và lấy phần tử thứ 2 (theo quy ước Bearer Token)
    let token = authorization.split(' ')[1]
    if(!token) {
        return res.status(401).json({code: 101, message: 'Please login first (Token not valid)'})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if(err) {
            return res.status(401).json({code: 102, message: 'Token NOT VALID or OUTDATE'})
        }
        req.user = data
        next()
    })
}