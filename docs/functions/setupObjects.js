function setupStudyInfo(study_name){
    study_info = {
        study_name: study_name,
        study_data: {},
        measurement_data: {},
        raw_data: {},
        condition_data: {},
        repetition_data: {},
        repetition_validated: {},
    };
    return study_info
}

function setupPublicationInfo(publication_name){
    publication_info = {
        publication_name: publication_name,
        study_info: {},
        publication_data: {},
    };
    return publication_info
}

function setupStatementSetInfo(statementset_name){
    statementset_info = {
        statementset_name: statementset_name,
        statementset_data: {},
    };
    return statementset_info
}