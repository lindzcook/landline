     
     
      $(function() {
        // Initialize the map
       	console.log('inside main.js');
       	
       	//make the tooltip template
        $("body").prepend('<script type="text/jst" id="landline_tooltip_tmpl"><h2><%= n %></h2><span class="tooltip_sub">Obesity Prevalence: <%= obesity %>%</span></script>');
        
        //title
        $("body").prepend('<h2>This Map Has a Title, This is Exciting </h2>');

        var map = new Landline.Stateline("#landline_container", "states");  
        
        // Set up the tooltip template
        var tmpl = _.template($("#landline_tooltip_tmpl").html());

        // Add tooltips, and cache the existing style
        // to put it back in place on mouseout
        map.on('mouseover', function(e, path, data) {
          data.existingStyle = (data.existingStyle || {});
          data.existingStyle["fill"]        = path.attr("fill");
          data.existingStyle["strokeWidth"] = path.attr("stroke-width");
          path.attr("fill", "#999").attr("stroke-width", 1);
        });

        map.on('mousemove', function(e, path, data) {
          $("#landline_tooltip").html(tmpl({
              n          : data.get('n'), 
              obesity : commaDelimit(census[data.fips][1])
            })).css("left", e.pageX + 20).css("top", e.pageY + 20).show();
        });

        map.on('mouseout', function(e, path, data) {
          $("#landline_tooltip").hide();
          _(data.existingStyle).each(function(v, k) {
            path.attr(k, v);
          });
        });

        // Census data convenience functions
        var obesityColor = function(obes) {
          if (obes < 20) return "rgb(237,248,233)";
          if (obes < 25) return "rgb(186,228,179)";
          if (obes < 30) return "rgb(116,196,118)";
          if (obes < 35) return "rgb(49,163,84)";
          return "rgb(0,109,44)";
        };
        
        //make the legend
        $("body").prepend('<strong>Legend</strong><br>');
        
        
        "width:500px;height:100px;border:1px solid #000;"

        var commaDelimit = function(a){
          return _.isNumber(a) ? a.toString().replace(/(d)(?=(ddd)+(?!d))/g,"$1,") : "";
        };

        // Color states by obes level
        _(census).each(function(ary, fips) {
          map.style(fips, "fill", obesityColor(ary[1]));
        }) 
        
        //styles
        
        $("body").append('<style>#landline_container {width:95%;max-width:600px;}#landline_tooltip {position:absolute;background:rgba(222, 222, 222, 0.95);z-index:999999;font-family: Helvetica, Arial, sans-serif;font-weight:bold;font-size:12px;padding:5px;border-radius:2px;box-shadow:0 0 5px #444;display:none;}#landline_tooltip h2 {margin:0;padding:0;font-size:14px;}.tooltip_sub {font-size:12px;font-weight:normal;display:inline-block;line-height:14px;}</style>');


        // Draw the map
        map.createMap();
      });