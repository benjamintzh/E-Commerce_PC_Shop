$(document).ready(function(){
    // Define state and city options for each country
    var locations = {
        "Malaysia": {
            "Johor": ["Johor Bahru", "Muar", "Batu Pahat", "Kluang"],
            "Kedah": ["Alor Setar", "Sungai Petani", "Kulim", "Langkawi"],
            "Kelantan": ["Kota Bharu", "Pasir Mas", "Gua Musang"],
            "Melaka": ["Melaka City", "Ayer Keroh", "Alor Gajah"],
            "Negeri Sembilan": ["Seremban", "Port Dickson", "Nilai"],
            "Pahang": ["Kuantan", "Bentong", "Temerloh"],
            "Perak": ["Ipoh", "Taiping", "Lumut"],
            "Perlis": ["Kangar", "Arau"],
            "Penang": ["George Town", "Butterworth", "Bayan Lepas", "Bukit Mertajam"],
            "Sabah": ["Kota Kinabalu", "Sandakan", "Tawau"],
            "Sarawak": ["Kuching", "Miri", "Sibu"],
            "Selangor": ["Shah Alam", "Petaling Jaya", "Subang Jaya", "Klang"]
        },
        "Singapore": {
            "Central": ["Orchard", "Bukit Timah", "Newton"],
            "North": ["Woodlands", "Yishun", "Sembawang"],
            "South": ["Marina Bay", "Sentosa", "Bukit Merah"],
            "East": ["Bedok", "Tampines", "Changi"],
            "West": ["Jurong", "Bukit Batok", "Clementi"]
        }
    };

    // Listen for changes on the country select element
    $("#country").change(function(){
        var selectedCountry = $(this).val();
        var stateSelect = $("#state");
        var citySelect = $("#city");
        
        stateSelect.empty().append($('<option>', { value: '', text: 'Select State' }));
        citySelect.empty().append($('<option>', { value: '', text: 'Select City' }));

        // Populate the state dropdown based on the selected country
        if (selectedCountry && locations[selectedCountry]) {
            $.each(locations[selectedCountry], function(state, cities){
                stateSelect.append($('<option>', { value: state, text: state }));
            });
        }
    });

    // Listen for changes on the state select element
    $("#state").change(function(){
        var selectedCountry = $("#country").val();
        var selectedState = $(this).val();
        var citySelect = $("#city");

        citySelect.empty().append($('<option>', { value: '', text: 'Select City' }));

        // Populate the city dropdown based on the selected state
        if (selectedCountry && selectedState && locations[selectedCountry][selectedState]) {
            $.each(locations[selectedCountry][selectedState], function(index, city){
                citySelect.append($('<option>', { value: city, text: city }));
            });
        }
    });
});
