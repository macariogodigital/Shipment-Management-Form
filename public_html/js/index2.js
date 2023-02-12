var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var spmtDBName = "DELIVERY-DB";
var spmtRelationName = "SHIPMENT-TABLE";
var connToken = "90932638|-31949276233506020|90948677";
$("#spmtid").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getSpmtIdAsJsonObj(){
     var spmtid = $('#spmtid').val();
     var jsonStr = {
         id: spmtid
     };
     return JSON.stringify(jsonStr);
 }

function fillData(jsonObj){

            saveRecNo2LS(jsonObj);
            var record = JSON.parse(jsonObj.data).record;
            $("#spmtdes").val(record.Shipment_No);
            $("#spmtsrc").val(record.Source);
            $('#des').val(record.Destination);
            $("#spdt").val(record.date);
            $("#eddt").val(record.date);
}

function ResetForm(){
            $("#spmtid").val("");
            $("#spmtdes").val("");
            $("#spmtsrc").val("");
            $("#des").val("");
            $("#spdt").val("");
            $("#eddt").val("");
            $("#spmtid").prop("disabled",false);
            $("#Save").prop("disabled",true);
            $("#Update").prop("disabled",true);
            $("#Reset").prop("disabled",true);
            $("#spmtid").focus();
}

function SaveData(){
            var jsonStrObj = validateData();
            if (jsonStrObj === "") {
                return "";
            }
            var putRequest = createPUTRequest(connToken,jsonStrObj,spmtDBName,spmtRelationName);
            jQuery.ajaxSetup({async: false});
            var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
            jQuery.ajaxSetup({async: true});
            ResetForm();
            $("#spmtid").focus();
}

function UpdateData(){
    $('#Update').prop('disabled',true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,spmtDBName,spmtRelationName,localStorage.getItem('recno'));
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    ResetForm();
    $("#spmtid").focus();
}

function validateData(){
            var spmtid,spmtdes,spmtsrc,des,spdt,eddt;
            spmtid = $("#spmtid").val();
            spmtdes = $("#spmtdes").val();
            spmtsrc = $("#spmtsrc").val();
            des = $("#des").val();
            spdt = $("#spdt").val();
            eddt = $("#eddt").val();
               
        if(spmtid === ""){
        alert("Shipment-No Required Value");
        $("#spmtid").focus();
            return "";
        }
        if(spmtdes === ""){
        alert("Description is Required Value");
        $("#spmtdes").focus();
            return "";
        }
        if(spmtsrc === ""){
        alert("Source is Required Value");
        $("#spmtsrc").focus();
        return "";
        }
        
        if(des === ""){
        alert("Destination is Required Value");
        $("#des").focus();
        return "";
        }
        
        if(spdt === "") {
        alert("Shipping Date is Required Value");
        $("#spdt").focus();
        return "";
        }
        
        if(eddt === "") {
        alert("Expected-Delivery-Date is Required Value");
        $("#eddt").focus();
        return "";
        }
        var jsonStrObj ={
        Shipment_No: spmtid,
        Description: spmtdes,
        Source : spmtsrc,
        Destination :des,
        ShippingDate : spdt,
        Expected_DeliveryDate:eddt
        };
        return JSON.stringify(jsonStrObj);
    }

function getSpmt(){
    var spmtIdJson0bj = getSpmtIdAsJsonObj(); 
    var getRequest =  createGET_BY_KEYRequest(connToken, spmtDBName, spmtRelationName,spmtIdJson0bj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL); 
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400){
         $("#Save").prop("disabled",false);
         $("#Reset").prop("disabled",false);
         $("#spmtdes").focus();
     } else if(resJsonObj.status === 200){
          $("#spmtid").prop("disabled",true);
          fillData(resJsonObj);
          $("#Update").prop("disabled", false);
          $("#Reset").prop("disabled", false);
          $("#spmtdes").focus();
   }
}




