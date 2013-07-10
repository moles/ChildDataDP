using System;
using System.Data;
using ChildDataPIN.ApplicationHelper;
using ChildDataPIN.BLL.Entities.SEG;
using ChildDataPIN.DAL.BASE;

namespace ChildDataPIN.DAL.SEG
{
    public class SegModuleDataAccess<TEntity> : DataAccess<TEntity>
             where TEntity : class, new()
    {

         public SegModuleDataAccess()
            : base(new SegEntities())
        {

        }

        public new SegEntities ctx
        {
            get
            {
                return (SegEntities)base.basectx;
            }
        }

    }
}
