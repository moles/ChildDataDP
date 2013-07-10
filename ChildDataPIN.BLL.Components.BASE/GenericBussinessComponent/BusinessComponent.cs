//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 11/13/2010 2:53:56 PM
//--------------------------------------------------------------------------------
//
// Description: {A brief description of what this class or enumeration does or is for} //
//--------------------------------------------------------------------------------
using System;

namespace ChildDataPIN.BLL.Components
{
    public class BusinessComponent : IDisposable
    {
        protected IDisposable dac;

        public BusinessComponent(IDisposable dac)
        {
            this.dac = dac;
        }

        public void Dispose()
        {
            if (dac != null)
                dac.Dispose();
        }
    }

}
