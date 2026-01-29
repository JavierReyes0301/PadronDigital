$(document).ready(function () {
  // Lógica de encadenamiento de selectores (Pais -> Estado -> Municipio)
  $("#Pais").change(function () {
    $("#Pais option:selected").each(function () {
      var Pais = $(this).val();
      // Reset de campos
      $("#Estado, #Municipio, #Localidad, #Valida2").val(0);
      $("#TodosDomicilio").hide();
      $("#NingunoDomicilio").show();
      $.post("SeleccionaEstado.php", { Pais: Pais }, function (data) {
        $("#Estado").html(data);
      });
    });
  });

  $("#Estado").change(function () {
    $("#Estado option:selected").each(function () {
      var Pais = $("#Pais").val();
      var Estado = $(this).val();
      $.post(
        "SeleccionaMunicipio.php",
        { Pais: Pais, Estado: Estado },
        function (data) {
          $("#Municipio").html(data);
        },
      );
    });
  });

  $("#Municipio").change(function () {
    $("#Municipio option:selected").each(function () {
      var Pais = $("#Pais").val();
      var Estado = $("#Estado").val();
      var Municipio = $(this).val();
      $.post(
        "SeleccionaLocalidad.php",
        { Pais: Pais, Estado: Estado, Municipio: Municipio },
        function (data) {
          $("#Localidad").html(data);
        },
      );
    });
  });

  $("#GiroSel").change(function () {
    $("#GiroSel option:selected").each(function () {
      var GiroSel = $(this).val();
      $.post("SeleccionaLinea.php", { GiroSel: GiroSel }, function (data) {
        $("#LineaSel").html(data).attr("disabled", false);
      });
    });
  });
});
