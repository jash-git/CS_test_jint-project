//Work~80mm
var Result = {};//�̲׵��G����
var json_obj = {};//��J�r�ꪺJSON����
var ESC_Value = [];//�s��O���Ҧ����X���C�L��T�}�C

function Main() {

    //---
    //�N��J��r�নJSON����
    try {
        json_obj = JSON.parse(input);
        WriteLog("input �ѪR���\");
        WriteLog(json_obj.store_name);
    }
    catch (e) {
        json_obj = null;
        WriteLog("input �ѪR����");
    }
    //---�N��J��r�নJSON����

    //---
    //�P�_�O����J��ƬO�_�X�k
    if (json_obj == null) {
        Result.state_code = 1;
        return JSON.stringify(Result);
    }
    else {
        Result.state_code = 0;
        ESC_Value.push(ecINITIALIZE_PRINTER);//�L�����l��
    }
    //---�P�_�O����J��ƬO�_�X�k

    GlobalVariable_Init();//�ѪRC#�ǰe�L�Ӫ��L��Ѽƨíק���������ܼ�

    //�ӫ~�X�֦C�L�\��b C# code ��{

    if (PrinterParms.product_single_cut == "N") {
        //���`�Ҧ�
        Normal();
    }
    else {
        //�@��@��
        SingleCut();
    }

    Result.value = ESC_Value;
    Result.log = Log_Value;
    return JSON.stringify(Result);
}