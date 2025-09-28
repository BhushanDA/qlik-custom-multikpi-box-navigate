define(["qlik", "jquery"], function(qlik, $) {
  "use strict";

  return {
    definition: {
      type: "items",
      component: "accordion",
      items: {
        measures: { uses: "measures", min: 1, max: 5 },
        boxTitle: { type: "string", label: "KPI Box Title", ref: "props.boxTitle", defaultValue: "My KPI Box" },

        target: { type: "number", label: "Target for Main KPI", ref: "props.target", defaultValue: 100 },
        navigateMain: { type: "string", label: "Sheet ID for Main KPI Navigation", ref: "props.navigateMain", defaultValue: "" },

        style: {
          type: "items",
          label: "Style Options",
          items: {
            cardColor: { type: "string", label: "Card Background", ref: "props.cardColor", defaultValue: "#ffffff" },
            boxRadius: { type: "number", label: "Card Border Radius (px)", ref: "props.boxRadius", defaultValue: 12 },
            borderColor: { type: "string", label: "Card Border Color", ref: "props.borderColor", defaultValue: "#cccccc" },
            borderWidth: { type: "number", label: "Card Border Width (px)", ref: "props.borderWidth", defaultValue: 1 },

            // âœ… KPI Box Title styles
            boxTitleFontSize: { type: "number", label: "KPI Box Title Size", ref: "props.boxTitleFontSize", defaultValue: 14 },
            boxTitleColor: { type: "string", label: "KPI Box Title Color", ref: "props.boxTitleColor", defaultValue: "#000000" },
            boxTitleBold: { type: "boolean", label: "Bold KPI Box Title", ref: "props.boxTitleBold", defaultValue: true },

            // Main KPI title + value styles
            mainKPITitleFontSize: { type: "number", label: "Main KPI Title Size", ref: "props.mainKPITitleFontSize", defaultValue: 14 },
            mainKPITitleColor: { type: "string", label: "Main KPI Title Color", ref: "props.mainKPITitleColor", defaultValue: "#333333" },
            mainKPITitleBold: { type: "boolean", label: "Bold Main KPI Title", ref: "props.mainKPITitleBold", defaultValue: true },

            mainKPIValueFontSize: { type: "number", label: "Main KPI Value Size", ref: "props.mainKPIValueFontSize", defaultValue: 24 },
            mainKPIValueFontColor: { type: "string", label: "Main KPI Value Color", ref: "props.mainKPIValueFontColor", defaultValue: "#2ca02c" },
            mainKPIValueBold: { type: "boolean", label: "Bold Main KPI Value", ref: "props.mainKPIValueBold", defaultValue: true },

            // Secondary KPI styles
            secondaryTitleFontSize: { type: "number", label: "Secondary KPI Title Size", ref: "props.secondaryTitleFontSize", defaultValue: 12 },
            secondaryTitleFontColor: { type: "string", label: "Secondary KPI Title Color", ref: "props.secondaryTitleFontColor", defaultValue: "#888888" },
            secondaryTitleBold: { type: "boolean", label: "Bold Secondary KPI Title", ref: "props.secondaryTitleBold", defaultValue: true },

            secondaryValueFontColor: { type: "string", label: "Secondary KPI Value Color", ref: "props.secondaryValueFontColor", defaultValue: "#555555" },
            secondaryValueBold: { type: "boolean", label: "Bold Secondary KPI Value", ref: "props.secondaryValueBold", defaultValue: false },

            // Progress bar options
            showProgressBar: { type: "boolean", label: "Show Progress Bar", ref: "props.showProgressBar", defaultValue: true },
            progressBarColor: { type: "string", label: "Progress Bar Color", ref: "props.progressBarColor", defaultValue: "#2ca02c" },
            progressBarBgColor: { type: "string", label: "Progress Bar Background", ref: "props.progressBarBgColor", defaultValue: "#eee" },
            showTarget: { type: "boolean", label: "Show Target Label", ref: "props.showTarget", defaultValue: true }
          }
        },
        settings: { uses: "settings" }
      }
    },

    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [{ qDef: { qDef: "0" } }],
        qInitialDataFetch: [{ qTop: 0, qLeft: 0, qHeight: 1, qWidth: 5 }]
      },
      props: {
        boxTitle: "My KPI Box",
        target: 100,
        navigateMain: "",
        cardColor: "#ffffff",
        boxRadius: 12,
        borderColor: "#cccccc",
        borderWidth: 1,

        // âœ… Box title defaults
        boxTitleFontSize: 14,
        boxTitleColor: "#000000",
        boxTitleBold: true,

        mainKPITitleFontSize: 14,
        mainKPITitleColor: "#333333",
        mainKPITitleBold: true,

        mainKPIValueFontSize: 24,
        mainKPIValueFontColor: "#2ca02c",
        mainKPIValueBold: true,

        secondaryTitleFontSize: 12,
        secondaryTitleFontColor: "#888888",
        secondaryTitleBold: true,
        secondaryValueFontColor: "#555555",
        secondaryValueBold: false,

        showProgressBar: true,
        progressBarColor: "#2ca02c",
        progressBarBgColor: "#eee",
        showTarget: true
      }
    },

    paint: function($element, layout) {
      var hc = layout.qHyperCube;
      if (!hc.qDataPages[0].qMatrix || !hc.qDataPages[0].qMatrix.length) {
        $element.html("<div style='padding:8px; text-align:center;'>No data</div>");
        return;
      }

      var row = hc.qDataPages[0].qMatrix[0];
      var target = layout.props.target || 100;

      var getVal = idx => row[idx] ? row[idx].qText : "N/A";
      var getNum = idx => row[idx] ? row[idx].qNum : 0;
      var getLabel = idx => hc.qMeasureInfo[idx] ? hc.qMeasureInfo[idx].qFallbackTitle : "";

      var measures = [];
      for (let i = 0; i < 5; i++) {
        if (hc.qMeasureInfo[i]) {
          measures.push({ valDisplay: getVal(i), valNumeric: getNum(i), label: getLabel(i) });
        }
      }

      var bgStyle = `background:${layout.props.cardColor};`;
      var radiusStyle = `border-radius:${layout.props.boxRadius}px;`;
      var borderStyle = `border:${layout.props.borderWidth}px solid ${layout.props.borderColor};`;

      var html = `<div style="
        height:100%; width:100%;
        ${bgStyle} ${radiusStyle} ${borderStyle}
        box-sizing:border-box;
        display:flex; align-items:center; justify-content:center;
      ">`;

      html += `<div style="padding:4px 6px; text-align:center; font-family:'Segoe UI', sans-serif; width:100%;">`;

      // âœ… KPI Box Title with style
      html += `<div style="
        font-size:${layout.props.boxTitleFontSize}px;
        color:${layout.props.boxTitleColor};
        ${layout.props.boxTitleBold ? "font-weight:bold;" : ""}
        margin-bottom:4px;
      ">${layout.props.boxTitle}</div>`;

      // Main KPI
      if (measures.length >= 1) {
        var mainVal = measures[0].valDisplay;
        var mainNum = measures[0].valNumeric;
        var progress = (mainNum && target > 0) ? Math.min(Math.max((mainNum / target) * 100, 0), 100) : 0;

        html += `<div class="mainKPI clickable" data-sheet="${layout.props.navigateMain}" style="cursor:pointer; margin-bottom:6px;">
          <div style="
            font-size:${layout.props.mainKPITitleFontSize}px;
            color:${layout.props.mainKPITitleColor};
            ${layout.props.mainKPITitleBold ? "font-weight:bold;" : ""}
          ">${measures[0].label}</div>

          <div style="
            font-size:${layout.props.mainKPIValueFontSize}px;
            color:${layout.props.mainKPIValueFontColor};
            ${layout.props.mainKPIValueBold ? "font-weight:bold;" : ""}
          ">${mainVal}</div>`;

        if (layout.props.showProgressBar) {
          html += `<div style="background:${layout.props.progressBarBgColor}; border-radius:4px; height:5px; width:70%; margin:4px auto;">
              <div style="width:${progress}%; background:${layout.props.progressBarColor}; height:100%; border-radius:4px;"></div>
            </div>`;
        }

        if (layout.props.showTarget) {
          html += `<div style="font-size:10px; color:#888;">Target: ${target}</div>`;
        }

        html += `</div>`;
      }

      // Secondary KPIs
      if (measures.length > 1) {
        let secMeasures = measures.slice(1);
        let secCount = secMeasures.length;
        let cols = (secCount % 2 === 0) ? 2 : 1;

        html += `<div style="
          display: grid;
          grid-template-columns: repeat(${cols}, 1fr);
          gap: 4px;
          margin-top: 6px;
        ">`;

        secMeasures.forEach((m) => {
          html += `<div style="text-align:center; font-size:${layout.props.secondaryTitleFontSize}px;">
            <span style="
              color:${layout.props.secondaryTitleFontColor};
              ${layout.props.secondaryTitleBold ? "font-weight:bold;" : ""}
            ">${m.label}</span> :
            <span style="
              color:${layout.props.secondaryValueFontColor};
              ${layout.props.secondaryValueBold ? "font-weight:bold;" : ""}
            ">${m.valDisplay}</span>
          </div>`;
        });

        html += `</div>`;
      }

      html += `</div></div>`;
      $element.html(html);

      $element.find(".mainKPI").on("click", function() {
        var sheetId = $(this).data("sheet");
        if (sheetId) qlik.navigation.gotoSheet(sheetId);
      });
    }
  };
});
