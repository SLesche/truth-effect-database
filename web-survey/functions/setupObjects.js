function setupStudyInfo(study_name){
    study_info = {
        study_name: study_name,
        data: {},
        num_datasets: 0,
        dataset_info: {},
    };
    return study_info
}

function setupPublicationInfo(publication_name){
    publication_info = {
        publication_name: publication_name,
        data: {},
        num_studies: 0,
        study_info: {},
    };
    return publication_info
}

function setupMeasurementInfo(measurement_name){
    measurement_info = {
        measurement_name: measurement_name,
        data: {},
    };
    return measurement_info
}

function setupDatasetInfo(dataset_name){
    dataset_info = {
        dataset_name: dataset_name,
        data: {},
    };
    return dataset_info
}