import json
import os

base_path = r"c:\Users\CBIT\Desktop\Food_product_Stitch-main\Food_product_Stitch-main\src\locales"

common_keys = {
    "products": {
        "verified_badge": "Verified Products",
        "db_title": "Food Product Database",
        "db_desc": "Browse our database of verified and reviewed food products.",
        "search_ph": "Search products or manufacturers...",
        "status": "Status",
        "status_all": "All Status",
        "status_genuine": "Genuine",
        "status_suspicious": "Suspicious",
        "status_fake": "Fake",
        "showing_count": "Showing {{count}} products",
        "loading": "Loading products...",
        "no_products": "No products found",
        "try_adjust": "Try adjusting your filters or search query."
    },
    "report": {
        "missing_info": "Missing information",
        "fill_fields": "Please fill in all required fields.",
        "success_title": "Report submitted successfully",
        "success_desc": "Thank you for helping protect consumers. An admin will review your report shortly.",
        "fail_title": "Failed to submit report",
        "thank_you": "Thank you for helping us maintain food safety. Our admin team will review your report within 24-48 hours.",
        "submit_another": "Submit Another Report",
        "badge": "Report Fake Product",
        "title": "Report a Suspicious Food Product",
        "desc": "Help protect other consumers by reporting fake or suspicious food products.",
        "details_title": "Report Details",
        "details_desc": "Please provide as much detail as possible to help us investigate.",
        "l_product": "Product Name *",
        "ph_product": "e.g., Organic Basmati Rice",
        "l_brand": "Brand Name *",
        "ph_brand": "e.g., Natural Foods Co",
        "l_fssai": "FSSAI License Number (Optional)",
        "ph_fssai": "e.g., 10020021000123",
        "l_where": "Where did you purchase?",
        "ph_where": "e.g., Local market, Online store",
        "l_reason": "Reason for Reporting *",
        "ph_reason": "Describe why you believe this food product is fake or suspicious...",
        "l_evidence": "Additional Evidence",
        "ph_evidence": "Any additional details, observations, or evidence...",
        "btn_submitting": "Submitting Report...",
        "btn_submit": "Submit Report"
    },
    "footer": {
        "protecting": "Protecting consumers through FSSAI-based food product authentication.",
        "made_with": "Made with",
        "for_food_safety": "for food safety",
        "copyright": "© 2024 TrustVerify. This is an academic project using mock data for demonstration purposes."
    }
}

hi_common_keys = {
    "products": {
        "verified_badge": "सत्यापित उत्पाद",
        "db_title": "खाद्य उत्पाद डेटाबेस",
        "db_desc": "सत्यापित और समीक्षित खाद्य उत्पादों का हमारा डेटाबेस ब्राउज़ करें।",
        "search_ph": "उत्पादों या निर्माताओं की खोज करें...",
        "status": "स्थिति",
        "status_all": "सभी स्थितियाँ",
        "status_genuine": "असली (Genuine)",
        "status_suspicious": "संदिग्ध",
        "status_fake": "नकली",
        "showing_count": "{{count}} उत्पाद दिखा रहा है",
        "loading": "उत्पाद लोड हो रहे हैं...",
        "no_products": "कोई उत्पाद नहीं मिला",
        "try_adjust": "अपने फ़िल्टर या खोज क्वेरी को समायोजित करने का प्रयास करें।"
    },
    "report": {
        "missing_info": "जानकारी गायब है",
        "fill_fields": "कृपया सभी आवश्यक फ़ील्ड भरें।",
        "success_title": "रिपोर्ट सफलतापूर्वक सबमिट की गई",
        "success_desc": "उपभोक्ताओं की रक्षा करने में मदद के लिए धन्यवाद। एक व्यवस्थापक जल्द ही आपकी रिपोर्ट की समीक्षा करेगा।",
        "fail_title": "रिपोर्ट सबमिट करने में विफल",
        "thank_you": "खाद्य सुरक्षा बनाए रखने में हमारी मदद करने के लिए धन्यवाद। हमारी व्यवस्थापक टीम 24-48 घंटों के भीतर आपकी रिपोर्ट की समीक्षा करेगी।",
        "submit_another": "एक अन्य रिपोर्ट सबमिट करें",
        "badge": "नकली उत्पाद की रिपोर्ट करें",
        "title": "एक संदिग्ध खाद्य उत्पाद की रिपोर्ट करें",
        "desc": "नकली या संदिग्ध खाद्य उत्पादों की रिपोर्ट करके अन्य उपभोक्ताओं की रक्षा करने में मदद करें।",
        "details_title": "रिपोर्ट विवरण",
        "details_desc": "कृपया जांच करने में हमारी मदद करने के लिए अधिक से अधिक विवरण प्रदान करें।",
        "l_product": "उत्पाद का नाम *",
        "ph_product": "उदा., ऑर्गेनिक बासमती चावल",
        "l_brand": "ब्रांड का नाम *",
        "ph_brand": "उदा., नेचुरल फूड्स कंपनी",
        "l_fssai": "FSSAI लाइसेंस नंबर (वैकल्पिक)",
        "ph_fssai": "उदा., 10020021000123",
        "l_where": "आपने कहाँ से खरीदा?",
        "ph_where": "उदा., स्थानीय बाज़ार, ऑनलाइन स्टोर",
        "l_reason": "रिपोर्ट करने का कारण *",
        "ph_reason": "वर्णन करें कि आपको क्यों लगता है कि यह खाद्य उत्पाद नकली या संदिग्ध है...",
        "l_evidence": "अतिरिक्त सबूत",
        "ph_evidence": "कोई अतिरिक्त विवरण, अवलोकन, या साक्ष्य...",
        "btn_submitting": "रिपोर्ट सबमिट की जा रही है...",
        "btn_submit": "रिपोर्ट सबमिट करें"
    },
    "footer": {
        "protecting": "FSSAI आधारित खाद्य उत्पाद प्रमाणीकरण के माध्यम से उपभोक्ताओं की रक्षा करना।",
        "made_with": "के साथ बना है",
        "for_food_safety": "खाद्य सुरक्षा के लिए",
        "copyright": "© 2024 TrustVerify. यह प्रदर्शन उद्देश्यों के लिए नकली डेटा का उपयोग करने वाली एक शैक्षणिक परियोजना है।"
    }
}

te_common_keys = {
    "products": {
        "verified_badge": "ధృవీకరించబడిన ఉత్పత్తులు",
        "db_title": "ఆహార ఉత్పత్తి డేటాబేస్",
        "db_desc": "మా ధృవీకరించబడిన ఆహార ఉత్పత్తుల ఆన్‌లైన్ డేటాబేస్‌ను బ్రౌజ్ చేయండి.",
        "search_ph": "ఉత్పత్తులు లేదా తయారీదారుల కోసం వెతకండి...",
        "status": "స్థితి",
        "status_all": "అన్ని స్థితులు",
        "status_genuine": "నిజమైన (Genuine)",
        "status_suspicious": "అనుమాన్యాస్పదమైనది",
        "status_fake": "నకిలీ",
        "showing_count": "{{count}} ఉత్పత్తులను చూపుతోంది",
        "loading": "ఉత్పత్తులు లోడ్ అవుతున్నాయి...",
        "no_products": "ఎలాంటి ఉత్పత్తులు కనుగొనబడలేదు",
        "try_adjust": "దయచేసి మీ సెర్చ్ క్వెరీని మార్చి మళ్ళీ ప్రయత్నించండి."
    },
    "report": {
        "missing_info": "సమాచారం లేదు",
        "fill_fields": "దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి.",
        "success_title": "నివేదిక విజయవంతంగా సమర్పించబడింది",
        "success_desc": "వినియోగదారులను రక్షించడంలో సహాయపడినందుకు ధన్యవాదాలు.",
        "fail_title": "నివేదిక విఫలమైంది",
        "thank_you": "ఆహార భద్రతను నిర్వహించడంలో మాకు సహాయం చేసినందుకు ధన్యవాదాలు. నిర్వాహక బృందం 24-48 గంటల్లో నివేదికను సమీక్షిస్తుంది.",
        "submit_another": "మరొక నివేదికను సమర్పించండి",
        "badge": "నకిలీ ఉత్పత్తిని నివేదించండి",
        "title": "అనుమానాస్పద ఆహార ఉత్పత్తిని నివేదించండి",
        "desc": "నకిలీ ఆహార ఉత్పత్తులను నివేదించడం ద్వారా వినియోగదారులను రక్షించడంలో సహాయపడండి.",
        "details_title": "నివేదిక వివరాలు",
        "details_desc": "దర్యాప్తు కోసం దయచేసి సాధ్యమైనంత ఎక్కువ వివరాలను అందించండి.",
        "l_product": "ఉత్పత్తి పేరు *",
        "ph_product": "ఉదా., ఆర్గానిక్ బాస్మతి రైస్",
        "l_brand": "బ్రాండ్ పేరు *",
        "ph_brand": "ఉదా., నేచురల్ ఫుడ్స్ కో.",
        "l_fssai": "FSSAI లైసెన్స్ సంఖ్య (ఐచ్ఛికం)",
        "ph_fssai": "ఉదా., 10020021000123",
        "l_where": "ఎక్కడ కొనుగోలు చేసారు?",
        "ph_where": "ఉదా., స్థానిక మార్కెట్, ఆన్‌లైన్ స్టోర్",
        "l_reason": "నివేదించడానికి కారణం *",
        "ph_reason": "ఈ ఆహార ఉత్పత్తి నకిలీది అని మీరు ఎందుకు అనుకుంటున్నారో వివరించండి...",
        "l_evidence": "అదనపు ఆధారాలు",
        "ph_evidence": "ఏదైనా అదనపు వివరాలు లేదా సాక్ష్యాలు...",
        "btn_submitting": "నివేదిక సమర్పించబడుతోంది...",
        "btn_submit": "నివేదికను సమర్పించండి"
    },
    "footer": {
        "protecting": "FSSAI ఆధారిత ఆహార ఉత్పత్తి ప్రామాణీకరణ ద్వారా వినియోగదారులను రక్షించడం.",
        "made_with": "దీనితో చేయబడింది.",
        "for_food_safety": "ఆహార భద్రత కోసం",
        "copyright": "© 2024 TrustVerify. ఇది ప్రదర్శన ప్రయోజనాల కోసం మాక్ డేటాను ఉపయోగించే అకడమిక్ ప్రాజెక్ట్."
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
