<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="carga.aspx.cs" Inherits="ChildDataPIN.UI.Carga" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>Click en "..." para seleccionar el archivo de deuda que desea cargar.</div>
    <div>unicamente se soportan archivos de excel.</div>
    <div style="border-style:solid;border-width:thin;">
    <table width="100%">
        <tr>
            <td style="width:60px;"><asp:Label ID="Label1" runat="server" AssociatedControlID="fileUpload" 
            Text="Attachment:"></asp:Label></td>
            <td><asp:FileUpload ID="fileUpload" runat="server" Width="100%"  
            />    </td>        
        </tr>        
    </table>
    </div>
     <div>
    <table width="100%">
        <tr>
            <td colspan="2" align="center">
                <asp:Button ID="Button1" runat="server" Text="Ok" onclick="Button1_Click" />&nbsp;&nbsp;&nbsp;
                <asp:Button ID="Button2" runat="server" Text="Cancel" 
                    onclientclick="window.close();" 
                    UseSubmitBehavior="False" CausesValidation="False"/></td>
        </tr>        
    </table>
    </div>
    <p>
        <asp:RequiredFieldValidator ID="validator" runat="server" 
            ControlToValidate="fileUpload" 
            ErrorMessage="You must select a file before submit"></asp:RequiredFieldValidator>
    </p>
    </form>
</body>
</html>
