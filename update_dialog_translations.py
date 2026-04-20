import json
import os

base_path = r"c:\Users\CBIT\Desktop\Food_product_Stitch-main\Food_product_Stitch-main\src\locales"

common_keys = {
    "dialog": {
        "reason_req": "Reason required",
        "reason_desc": "Please provide a reason for reporting this product.",
        "success": "Report submitted",
        "success_desc": "Thank you for helping us maintain product authenticity. Our team will review your report.",
        "failed": "Report failed",
        "failed_desc": "Failed to submit report. Please try again later.",
        "title": "Report Suspicious Product",
        "desc": "Help protect other consumers by reporting fake or suspicious products. Our admin team will review your report.",
        "l_details": "Product Details",
        "l_name": "Name:",
        "l_brand": "Brand:",
        "l_fssai": "FSSAI:",
        "l_reason": "Reason for reporting *",
        "ph_reason": "Describe why you believe this product is fake or suspicious...",
        "l_evidence": "Additional evidence (optional)",
        "ph_evidence": "Any additional details that might help our investigation...",
        "btn_cancel": "Cancel",
        "btn_submitting": "Submitting...",
        "btn_submit": "Submit Report"
    }
}

hi_common_keys = {
    "dialog": {
        "reason_req": "कारण आवश्यक",
        "reason_desc": "कृपया इस उत्पाद की रिपोर्ट करने का कारण प्रदान करें।",
        "success": "रिपोर्ट जमा की गई",
        "success_desc": "उत्पाद प्रामाणिकता बनाए रखने में हमारी मदद करने के लिए धन्यवाद। हमारी टीम आपकी रिपोर्ट की समीक्षा करेगी।",
        "failed": "रिपोर्ट विफल",
        "failed_desc": "रिपोर्ट सबमिट करने में विफल। कृपया बाद में पुनः प्रयास करें।",
        "title": "संदिग्ध उत्पाद की रिपोर्ट करें",
        "desc": "नकली या संदिग्ध उत्पादों की रिपोर्ट करके अन्य उपभोक्ताओं की सुरक्षा में मदद करें। हमारी व्यवस्थापक टीम आपकी रिपोर्ट की समीक्षा करेगी।",
        "l_details": "उत्पाद विवरण",
        "l_name": "नाम:",
        "l_brand": "ब्रांड:",
        "l_fssai": "FSSAI:",
        "l_reason": "रिपोर्ट करने का कारण *",
        "ph_reason": "वर्णन करें कि आपको क्यों लगता है कि यह उत्पाद नकली या संदिग्ध है...",
        "l_evidence": "अतिरिक्त सबूत (वैकल्पिक)",
        "ph_evidence": "कोई अतिरिक्त विवरण जो हमारी जांच में मदद कर सकता है...",
        "btn_cancel": "रद्द करें",
        "btn_submitting": "सबमिट किया जा रहा है...",
        "btn_submit": "रिपोर्ट सबमिट करें"
    }
}

te_common_keys = {
    "dialog": {
        "reason_req": "కారణం అవసరం",
        "reason_desc": "దయచేసి ఈ ఉత్పత్తిని నివేదించడానికి కారణాన్ని అందించండి.",
        "success": "నివేదిక సమర్పించబడింది",
        "success_desc": "ఉత్పత్తి ప్రామాణికతను నిర్వహించడంలో మాకు సహాయపడినందుకు ధన్యవాదాలు. మా బృందం మీ నివేదికను సమీక్షిస్తుంది.",
        "failed": "నివేదిక విఫలమైంది",
        "failed_desc": "దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",
        "title": "అనుమానాస్పద ఉత్పత్తిని నివేదించండి",
        "desc": "నకిలీ ఉత్పత్తులను నివేదించడం ద్వారా వినియోగదారులను రక్షించడంలో సహాయపడండి. మా బృందం మీ నివేదికను సమీక్షిస్తుంది.",
        "l_details": "ఉత్పత్తి వివరాలు",
        "l_name": "పేరు:",
        "l_brand": "బ్రాండ్:",
        "l_fssai": "FSSAI:",
        "l_reason": "నివేదించడానికి కారణం *",
        "ph_reason": "ఈ ఉత్పత్తి నకిలీదని మీరు ఎందుకు భావిస్తున్నారో వివరించండి...",
        "l_evidence": "అదనపు ఆధారం (ఐచ్ఛికం)",
        "ph_evidence": "మా విచారణకు సహాయపడే ఏదైనా అదనపు వివరాలు...",
        "btn_cancel": "రద్దు చేయండి",
        "btn_submitting": "సమర్పిస్తోంది...",
        "btn_submit": "నివేదికను సమర్పించండి"
    }
}

locales = {
    "en": common_keys,
    "hi": hi_common_keys,
    "te": te_common_keys
}

for lang, data in locales.items():
    file_path = os.path.join(base_path, lang, "translation.json")
    with open(file_path, "r", encoding="utf-8") as f:
        existing = json.load(f)
    existing.update(data)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

print("Translations updated successfully.")
