//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 11/7/2010 1:30:02 PM
//--------------------------------------------------------------------------------
//
// Description: Clase para instanciar la conexion del data model
//--------------------------------------------------------------------------------

using System;
using ChildDataPIN.ApplicationHelper;
using ChildDataPIN.BLL.Entities.BASE;

namespace ChildDataPIN.DAL.BASE
{
    public class BaseModuleDataAccess<TEntity> : DataAccess<TEntity>
          where TEntity : class, new()
    {

        public BaseModuleDataAccess()
            : base(new BaseEntities())
        {

        }

        public new BaseEntities ctx
        {
            get
            {
                return (BaseEntities)base.basectx;
            }
        }

    }
}
