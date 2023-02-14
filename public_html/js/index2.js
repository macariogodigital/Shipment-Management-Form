var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var spmtDBName = "DELIVERY-DB";
var spmtRelationName = "SHIPMENT-TABLE";
var connToken = "90932638|-31949276233506020|90948677";
$("#spmtno").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getSpmtNoAsJsonObj(){
     var spmtno = $('#spmtno').val();
     var jsonStr = {
         Shipment_No: spmtno
     };
     return JSON.stringify(jsonStr);
 }

function fillData(jsonObj){
            saveRecNo2LS(jsonObj);
            var record = JSON.parse(jsonObj.data).record;
            $("#spmtdes").val(record.Description);
            $("#spmtsrc").val(record.Source);
            $('#spmtdest').val(record.Destination);
            $("#spmtdt").val(record.Shipment_Date);
            $("#spmtedt").val(record.Shipment_Expected_Date);
        }

function resetForm(){
            $("#spmtno").val("");
            $("#spmtdes").val("");
            $("#spmtsrc").val("");
            $("#spmtdest").val("");
            $("#spmtdt").val("");
            $("#spmtedt").val("");
            $("#spmtno").prop("disabled",false);
            $("#save").prop("disabled",true);
            $("#change").prop("disabled",true);
            $("#reset").prop("disabled",true);
            $("#spmtno").focus();
        }

function saveData(){
            var jsonStrObj = validateData();
            if (jsonStrObj === "") {
                return "";
            }
            var putRequest = createPUTRequest(connToken,jsonStrObj,spmtDBName,spmtRelationName);
            jQuery.ajaxSetup({async: false});
            var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
            jQuery.ajaxSetup({async: true});
            resetForm();
            $("#spmtno").focus();
        }

function changeData(){
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,spmtDBName,spmtRelationName,localStorage.getItem('recno'));
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#spmtno").focus();
}

function validateData(){
            var spmtno, spmtdes, spmtsrc, spmtdest, spmtdt, spmtedt;
            spmtno = $("#spmtno").val();
            spmtdes = $("#spmtdes").val();
            spmtsrc = $("#spmtsrc").val();
            spmtdest = $("#spmtdest").val();
            spmtdt = $("#spmtdt").val();
            spmtedt = $("#spmtedt").val();
               
        if(spmtno === ""){
        alert("Shipment_No Required Value");
        $("#spmtno").focus();
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
        
        if(spmtdest === ""){
        alert("Destination is Required Value");
        $("#spmtdest").focus();
        return "";
        }
        
        if(spmtdt === "") {
        alert("Shipment Date is Required Value");
        $("#spmtdt\n").focus();
        return "";
        }
        
        if(spmtedt === "") {
        alert("Expected Delivery Date is Required Value");
        $("#spmtedt").focus();
        return "";
        }
        var jsonStrObj = {
        Shipment_No: spmtno,
        Description: spmtdes,
        Source : spmtsrc,
        Destination :spmtdest,
        Shipment_Date : spmtdt,
        Shipment_Expected_Date:spmtedt
     };
     return JSON.stringify(jsonStrObj);
    }

function getSpmt(){
    var spmtNoJson0bj = getSpmtNoAsJsonObj(); 
    var getRequest =  createGET_BY_KEYRequest(connToken, spmtDBName, spmtRelationName,spmtNoJson0bj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL); 
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400){
         $("#save").prop("disabled", false);
         $("#reset").prop("disabled", false);
         $("#spmtdes").focus();
      } else if (resJsonObj.status === 200){
         
          $("#spmtno").prop("disabled",true);
          fillData(resJsonObj);
          $("#change").prop("disabled", false);
          $("#reset").prop("disabled", false);
          $("#spmtdes").focus();
      } 
}
