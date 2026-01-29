export const paymentMethods = {
    // ===== E-WALLET =====
    'gopay': {
        midtrans_code: 'gopay',
        display_name: 'GoPay',
        feeType: 'percentage',
        adminFee: 2 / 100,
        isActive: true
    },
    'shopeepay': {
        midtrans_code: 'shopeepay',
        display_name: 'ShopeePay',
        feeType: 'percentage',
        adminFee: 2 / 100,
        isActive: false
    },
    'dana': {
        midtrans_code: 'dana',
        display_name: 'DANA',
        feeType: 'percentage',
        adminFee: 1.5 / 100,
        isActive: true
    },

    // ===== VIRTUAL ACCOUNT =====
    'permata_va': {
        midtrans_code: 'permata_va',
        display_name: 'Permata Virtual Account',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true
    },
    'bni_va': {
        midtrans_code: 'bni_va',
        display_name: 'BNI Virtual Account',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true
    },
    'bca_va': {
        midtrans_code: 'bca_va',
        display_name: 'BCA Virtual Account',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: false
    },
    'echannel': {
        midtrans_code: 'echannel',
        display_name: 'Mandiri Virtual Account',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true
    },
    'bri_va': {
        midtrans_code: 'bri_va',
        display_name: 'BRI Virtual Account',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true
    },
    'other_va': {
        midtrans_code: 'other_va',
        display_name: 'Other Bank Virtual Account',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true
    },

    // ===== QR & BANK TRANSFER =====
    'qris': {
        midtrans_code: 'qris',
        display_name: 'QRIS',
        feeType: 'percentage',
        adminFee: 0.7 / 100,
        isActive: false
    },

    // ===== DATA BARU (isActive: false) =====
    'cimb_va': {
        midtrans_code: 'cimb_va',
        display_name: 'CIMB Niaga Virtual Account',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true
    },
    'danamon_va': {
        midtrans_code: 'danamon_va',
        display_name: 'Danamon Virtual Account',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true
    },
    'alfamart': {
        midtrans_code: 'alfamart',
        display_name: 'Alfamart',
        feeType: 'fixed',
        adminFee: 5000,
        isActive: false
    },
    'indomaret': {
        midtrans_code: 'indomaret',
        display_name: 'Indomaret',
        feeType: 'fixed',
        adminFee: 5000,
        isActive: false
    },
    'credit_card': {
        midtrans_code: 'credit_card',
        display_name: 'Credit Card',
        feeType: 'percentage',
        adminFee: 2.9 / 100,
        isActive: false
    },
    'linkaja': {
        midtrans_code: 'linkaja',
        display_name: 'LinkAja',
        feeType: 'percentage',
        adminFee: 2 / 100,
        isActive: false
    },
    'ovo': {
        midtrans_code: 'ovo',
        display_name: 'OVO',
        feeType: 'percentage',
        adminFee: 2 / 100,
        isActive: false
    }
};

export const countAdminFee = (baseAmount, paymentMethod) => {
    const method = paymentMethods[paymentMethod];
    if (!method || !method.isActive) return 0;

    if (method.feeType === 'fixed') {
        return method.adminFee;
    } else if (method.feeType === 'percentage') {
        return Math.ceil(baseAmount * method.adminFee);
    }
}
