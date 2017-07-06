using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Yooya.Bpm.Models.Interface
{
    public interface INodeMovement
    {
        string Id { get; set; }
        float? X { get; set; }
        float? Y { get; set; }
        //以下四个字段是给画图使用
        float Width { get; set; }
        float Height { get; set; }
        //0 代表图片类型， 1代表方形， 2代表圆形， 圆形使用x,y代表中心点，width代表半径 目前只有0
        int ShapeType { get; set; }
        string ImageSrc { get; set; } 
    }
}