"""
Study Abroad workflow: Stage → Sub Stage options.
When Stage changes, only matching Sub Stages are allowed.
"""

STAGE_NEW_ENQUIRY = 'New Enquiry'
STAGE_COUNSELLING = 'Counselling'
STAGE_COURSE_SELECTION = 'Course Selection'
STAGE_APPLICATION = 'Application'
STAGE_OFFER_LETTER = 'Offer Letter'
STAGE_FINANCIAL = 'Financial'
STAGE_VISA = 'Visa'
STAGE_TRAVEL = 'Travel'
STAGE_ENROLLED = 'Enrolled'
STAGE_CLOSED = 'Closed'

STAGE_CHOICES = [
    (STAGE_NEW_ENQUIRY, 'New Enquiry'),
    (STAGE_COUNSELLING, 'Counselling'),
    (STAGE_COURSE_SELECTION, 'Course Selection'),
    (STAGE_APPLICATION, 'Application'),
    (STAGE_OFFER_LETTER, 'Offer Letter'),
    (STAGE_FINANCIAL, 'Financial'),
    (STAGE_VISA, 'Visa'),
    (STAGE_TRAVEL, 'Travel'),
    (STAGE_ENROLLED, 'Enrolled'),
    (STAGE_CLOSED, 'Closed'),
]

LEAD_STAGES_LIST = [value for value, _label in STAGE_CHOICES]

STAGE_SUB_STAGES = {
    STAGE_NEW_ENQUIRY: [
        'Fresh Lead',
        'Contact Attempted',
        'Interested',
        'Not Interested',
    ],
    STAGE_COUNSELLING: [
        'Session Scheduled',
        'Session Completed',
        'Waiting for Documents',
    ],
    STAGE_COURSE_SELECTION: [
        'Country Selected',
        'University Shortlisted',
        'Course Finalized',
    ],
    STAGE_APPLICATION: [
        'Documents Pending',
        'Documents Received',
        'Application Submitted',
        'Under Review',
    ],
    STAGE_OFFER_LETTER: [
        'Conditional Offer',
        'Unconditional Offer',
        'Offer Accepted',
    ],
    STAGE_FINANCIAL: [
        'Fee Structure Shared',
        'Loan In Progress',
        'Payment Completed',
    ],
    STAGE_VISA: [
        'Visa Documents Pending',
        'Visa Applied',
        'Visa Interview',
        'Visa Approved',
        'Visa Rejected',
    ],
    STAGE_TRAVEL: [
        'Flight Booked',
        'Accommodation Booked',
        'Travel Completed',
    ],
    STAGE_ENROLLED: [
        'University Joined',
        'Orientation Completed',
    ],
    STAGE_CLOSED: [
        'Converted',
        'Lost',
    ],
}

APPLICATION_IN_PROGRESS_SUB_STAGES = [
    'Documents Pending',
    'Documents Received',
    'Application Submitted',
    'Under Review',
]

VISA_PROCESSING_SUB_STAGES = [
    'Visa Documents Pending',
    'Visa Applied',
    'Visa Interview',
]

SUB_STAGE_VISA_APPROVED = 'Visa Approved'
SUB_STAGE_NEEDS_FOLLOWUP = 'Waiting for Documents'
SUB_STAGE_APPLICATION_SUBMITTED = 'Application Submitted'


def get_sub_stages(stage):
    """Return the list of sub stages for a given stage."""
    return STAGE_SUB_STAGES.get(stage, [])


def get_default_sub_stage(stage):
    """Return the first sub stage for a stage (used when stage changes)."""
    options = get_sub_stages(stage)
    return options[0] if options else ''


def is_valid_sub_stage(stage, sub_stage):
    """Check if a sub stage belongs to the given stage."""
    if not sub_stage:
        return True
    return sub_stage in get_sub_stages(stage)
