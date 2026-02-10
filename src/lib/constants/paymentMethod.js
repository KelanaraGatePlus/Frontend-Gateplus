import Gopay from "@@/PaymentMethodLogo/Gopay.png";
import Shopeepay from "@@/PaymentMethodLogo/Shopeepay.png";
import Dana from "@@/PaymentMethodLogo/Dana.png";
import Permata from "@@/PaymentMethodLogo/Permata.png";
import BNI from "@@/PaymentMethodLogo/BNI.png";
import BCA from "@@/PaymentMethodLogo/BCA.png";
import Mandiri from "@@/PaymentMethodLogo/Mandiri.png";
import Cimbniaga from "@@/PaymentMethodLogo/Cimbniaga.png";
import Danamon from "@@/PaymentMethodLogo/Danamon.png";
import BRI from "@@/PaymentMethodLogo/BRI.png";
import Atmbersama from "@@/PaymentMethodLogo/Atmbersama.png";
import QRIS from "@@/PaymentMethodLogo/QRIS.png";


export const paymentMethods = {
    // ===== E-WALLET =====
    'gopay': {
        midtrans_code: 'gopay',
        display_name: 'GoPay',
        feeType: 'percentage',
        adminFee: 2 / 100,
        isActive: true,
        logo: Gopay
    },
    'shopeepay': {
        midtrans_code: 'shopeepay',
        display_name: 'ShopeePay',
        feeType: 'percentage',
        adminFee: 2 / 100,
        isActive: false,
        logo: Shopeepay
    },
    'dana': {
        midtrans_code: 'dana',
        display_name: 'DANA',
        feeType: 'percentage',
        adminFee: 1.5 / 100,
        isActive: true,
        logo: Dana
    },

    // ===== VIRTUAL ACCOUNT =====
    'permata_va': {
        midtrans_code: 'permata_va',
        display_name: 'VA Permata',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true,
        logo: Permata
    },
    'bni_va': {
        midtrans_code: 'bni_va',
        display_name: 'VA BNI',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true,
        logo: BNI
    },
    'bca_va': {
        midtrans_code: 'bca_va',
        display_name: 'VA BCA',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: false,
        logo: BCA
    },
    'echannel': {
        midtrans_code: 'echannel',
        display_name: 'VA Mandiri',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true,
        logo: Mandiri
    },
    'bri_va': {
        midtrans_code: 'bri_va',
        display_name: 'VA BRI',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true,
        logo: BRI
    },
    'other_va': {
        midtrans_code: 'other_va',
        display_name: 'Other Bank',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true,
        logo: Atmbersama
    },

    // ===== QR & BANK TRANSFER =====
    'qris': {
        midtrans_code: 'qris',
        display_name: 'QRIS',
        feeType: 'percentage',
        adminFee: 0.7 / 100,
        isActive: true,
        logo: QRIS
    },

    // ===== DATA BARU (isActive: false) =====
    'cimb_va': {
        midtrans_code: 'cimb_va',
        display_name: 'VA CIMB Niaga',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true,
        logo: Cimbniaga
    },
    'danamon_va': {
        midtrans_code: 'danamon_va',
        display_name: 'VA Danamon',
        feeType: 'fixed',
        adminFee: 4000,
        isActive: true,
        logo: Danamon
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
