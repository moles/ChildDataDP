using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ChildDataPIN.BLL.Components.COM;

namespace ChildDataPIN.UI
{
    public partial class Carga : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            string fileName = string.Empty;

            if (!string.IsNullOrEmpty(fileName = IsValidFile()))
            {
                try
                {
                    DeudaComunicacionesBLL bc = new DeudaComunicacionesBLL();

                    bc.GuardarDeudas(fileName, null);

                    Response.Write("<script language='javascript'>window.close();</script>");

                }
                catch (Exception ex)
                {
                    validator.IsValid = false;
                    validator.ErrorMessage = ex.Message;
                }
            }
        }

        private string IsValidFile()
        {
            try
            {
                Random random = new Random();

                string path = System.Web.Configuration.WebConfigurationManager.AppSettings.Get("PathCargaDeudasComunicacion");

                string fileName = path + random.NextDouble().ToString().Replace(".", "") + ".xls";

                if (fileUpload.HasFile == false)
                {
                    return string.Empty;
                }
                if (fileUpload.FileName.Substring(fileUpload.FileName.Length - 3).ToUpper() != "XLS" && fileUpload.FileName.Substring(fileUpload.FileName.Length - 4).ToUpper() != "XLSX")
                {
                    validator.IsValid = false;
                    validator.ErrorMessage = "El archivo debe estar en formato de Excel";

                    return string.Empty;
                }

                fileUpload.SaveAs(fileName);

                return fileName;
            }
            catch (Exception ex)
            {
                validator.IsValid = false;
                validator.ErrorMessage = ex.Message;
            }

            return string.Empty;
        }
    }
}