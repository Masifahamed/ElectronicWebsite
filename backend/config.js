// export const PORT=process.env.PORT||3500;
// export const MONGODB_URI='mongodb+srv://MasifAhamed:masifwebsite786@masif.y5p06xq.mongodb.net/ecommerce?appName=masif'
//password:masifahamed@786
//username:masifahamed
//recent password:masif123@#786ahamed

import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// mongodb+srv://ahamed:ahamed@786@masif.y5p06xq.mongodb.net/?appName=masif