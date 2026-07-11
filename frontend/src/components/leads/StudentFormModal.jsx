import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FormField, fieldClass } from '../common/FormField';
import { LEAD_STAGES, getSubStages, getDefaultSubStage, DEFAULT_STAGE } from '../../constants/leadStages';
import {
  LEAD_SOURCES,
  FOLLOWUP_TYPES,
  PREFERRED_COUNTRIES,
  PREFERRED_INTAKES,
  PREFERRED_COURSES,
  PRIORITIES,
  QUALIFICATIONS,
  ENGLISH_TESTS,
} from '../../constants/options';
import { validateStudentStep } from '../../utils/validation';

const STEPS = [
  { id: 'personal', title: 'Personal Details', short: 'Personal' },
  { id: 'education', title: 'Education Details', short: 'Education' },
  { id: 'preferences', title: 'Study Abroad Preferences', short: 'Preferences' },
  { id: 'counselling', title: 'Counselling Details', short: 'Counselling' },
  { id: 'documents', title: 'Documents', short: 'Documents' },
  { id: 'followup', title: 'Follow Up', short: 'Follow Up' },
];

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  mobile: '',
  alternateMobile: '',
  email: '',
  address: '',
  city: '',
  district: '',
  state: '',
  homeCountry: '',
  highestQualification: '',
  graduationYear: '',
  cgpaPercentage: '',
  currentCollege: '',
  workExperience: '',
  englishTest: 'none',
  englishScore: '',
  preferredCountry: '',
  preferredCity: '',
  preferredCourse: '',
  preferredUniversity: '',
  preferredIntake: '',
  budget: '',
  loanRequired: false,
  leadSource: 'Website',
  priority: 'medium',
  stage: DEFAULT_STAGE,
  subStage: getDefaultSubStage(DEFAULT_STAGE),
  assignedEmployee: '',
  remarks: '',
  passportAvailable: false,
  passportNumber: '',
  followupDate: '',
  followupType: 'call',
  followupRemarks: '',
  followupStatus: 'pending',
};

function Stepper({ currentStep }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isDone
                      ? 'bg-violet-600 text-white'
                      : isActive
                        ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-300'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`hidden truncate text-[10px] font-medium sm:block ${
                    isActive ? 'text-violet-700' : isDone ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {step.short}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 rounded ${isDone ? 'bg-violet-400' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900">{STEPS[currentStep].title}</p>
    </div>
  );
}

export default function StudentFormModal({ employees, isOpen, onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      ...EMPTY_FORM,
      assignedEmployee: employees[0] || '',
      stage: DEFAULT_STAGE,
      subStage: getDefaultSubStage(DEFAULT_STAGE),
    });
    setStep(0);
    setErrors({});
    setSubmitError('');
    setSubmitting(false);
  }, [isOpen, employees]);

  const subStageOptions = getSubStages(form.stage);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleStageChange(stage) {
    setForm((prev) => ({
      ...prev,
      stage,
      subStage: getDefaultSubStage(stage),
    }));
  }

  function goNext() {
    const stepErrors = validateStudentStep(step, form);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const stepErrors = validateStudentStep(step, form);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to save student. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Student"
      subtitle="Study abroad enquiry — complete each section"
      size="2xl"
    >
      <form onSubmit={handleSubmit}>
        <Stepper currentStep={step} />

        <div className="min-h-[280px] space-y-4">
          {step === 0 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="First Name" required error={errors.firstName}>
                  <input type="text" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} className={fieldClass(errors.firstName)} />
                </FormField>
                <FormField label="Last Name" required error={errors.lastName}>
                  <input type="text" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} className={fieldClass(errors.lastName)} />
                </FormField>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Gender">
                  <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className={fieldClass(false)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>
                <FormField label="Date of Birth">
                  <input type="date" value={form.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} className={fieldClass(false)} />
                </FormField>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Mobile" required error={errors.mobile}>
                  <input type="text" value={form.mobile} onChange={(e) => handleChange('mobile', e.target.value)} className={fieldClass(errors.mobile)} placeholder="10-digit number" />
                </FormField>
                <FormField label="Alternate Mobile" error={errors.alternateMobile}>
                  <input type="text" value={form.alternateMobile} onChange={(e) => handleChange('alternateMobile', e.target.value)} className={fieldClass(errors.alternateMobile)} />
                </FormField>
              </div>
              <FormField label="Email" required error={errors.email}>
                <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={fieldClass(errors.email)} />
              </FormField>
              <FormField label="Address">
                <textarea rows={2} value={form.address} onChange={(e) => handleChange('address', e.target.value)} className={`${fieldClass(false)} resize-none`} />
              </FormField>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="City">
                  <input type="text" value={form.city} onChange={(e) => handleChange('city', e.target.value)} className={fieldClass(false)} />
                </FormField>
                <FormField label="District">
                  <input type="text" value={form.district} onChange={(e) => handleChange('district', e.target.value)} className={fieldClass(false)} />
                </FormField>
                <FormField label="State">
                  <input type="text" value={form.state} onChange={(e) => handleChange('state', e.target.value)} className={fieldClass(false)} />
                </FormField>
                <FormField label="Home Country">
                  <input type="text" value={form.homeCountry} onChange={(e) => handleChange('homeCountry', e.target.value)} className={fieldClass(false)} />
                </FormField>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Highest Qualification">
                  <select value={form.highestQualification} onChange={(e) => handleChange('highestQualification', e.target.value)} className={fieldClass(false)}>
                    <option value="">Select</option>
                    {QUALIFICATIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Graduation Year" error={errors.graduationYear}>
                  <input type="number" value={form.graduationYear} onChange={(e) => handleChange('graduationYear', e.target.value)} className={fieldClass(errors.graduationYear)} placeholder="e.g. 2024" />
                </FormField>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="CGPA / Percentage">
                  <input type="text" value={form.cgpaPercentage} onChange={(e) => handleChange('cgpaPercentage', e.target.value)} className={fieldClass(false)} placeholder="e.g. 8.2 or 78%" />
                </FormField>
                <FormField label="Work Experience">
                  <input type="text" value={form.workExperience} onChange={(e) => handleChange('workExperience', e.target.value)} className={fieldClass(false)} placeholder="e.g. 2 years" />
                </FormField>
              </div>
              <FormField label="Current College / University">
                <input type="text" value={form.currentCollege} onChange={(e) => handleChange('currentCollege', e.target.value)} className={fieldClass(false)} />
              </FormField>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="English Test">
                  <select value={form.englishTest} onChange={(e) => handleChange('englishTest', e.target.value)} className={fieldClass(false)}>
                    {ENGLISH_TESTS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="English Score">
                  <input type="text" value={form.englishScore} onChange={(e) => handleChange('englishScore', e.target.value)} className={fieldClass(false)} placeholder="e.g. 7.0" disabled={form.englishTest === 'none'} />
                </FormField>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Preferred Country" required error={errors.preferredCountry}>
                  <select value={form.preferredCountry} onChange={(e) => handleChange('preferredCountry', e.target.value)} className={fieldClass(errors.preferredCountry)}>
                    <option value="">Select country</option>
                    {PREFERRED_COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Preferred City">
                  <input type="text" value={form.preferredCity} onChange={(e) => handleChange('preferredCity', e.target.value)} className={fieldClass(false)} placeholder="e.g. Toronto" />
                </FormField>
              </div>
              <FormField label="Preferred Course" required error={errors.preferredCourse}>
                <select value={form.preferredCourse} onChange={(e) => handleChange('preferredCourse', e.target.value)} className={fieldClass(errors.preferredCourse)}>
                  <option value="">Select course</option>
                  {PREFERRED_COURSES.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Preferred University">
                <input type="text" value={form.preferredUniversity} onChange={(e) => handleChange('preferredUniversity', e.target.value)} className={fieldClass(false)} />
              </FormField>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Preferred Intake">
                  <select value={form.preferredIntake} onChange={(e) => handleChange('preferredIntake', e.target.value)} className={fieldClass(false)}>
                    <option value="">Select intake</option>
                    {PREFERRED_INTAKES.map((intake) => (
                      <option key={intake} value={intake}>{intake}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Budget">
                  <input type="text" value={form.budget} onChange={(e) => handleChange('budget', e.target.value)} className={fieldClass(false)} placeholder="e.g. 25-30 Lakh" />
                </FormField>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.loanRequired}
                  onChange={(e) => handleChange('loanRequired', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                Education loan required
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Lead Source">
                  <select value={form.leadSource} onChange={(e) => handleChange('leadSource', e.target.value)} className={fieldClass(false)}>
                    {LEAD_SOURCES.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Priority">
                  <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)} className={fieldClass(false)}>
                    {PRIORITIES.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Stage">
                  <select value={form.stage} onChange={(e) => handleStageChange(e.target.value)} className={fieldClass(false)}>
                    {LEAD_STAGES.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Sub Stage">
                  <select value={form.subStage} onChange={(e) => handleChange('subStage', e.target.value)} className={fieldClass(false)}>
                    {subStageOptions.map((subStage) => (
                      <option key={subStage} value={subStage}>{subStage}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">Counselor assignment</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  New enquiries are assigned automatically to active counselors using Round Robin.
                </p>
              </div>
              <FormField label="Remarks">
                <textarea rows={3} value={form.remarks} onChange={(e) => handleChange('remarks', e.target.value)} className={`${fieldClass(false)} resize-none`} placeholder="Counselling notes..." />
              </FormField>
            </>
          )}

          {step === 4 && (
            <>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.passportAvailable}
                  onChange={(e) => handleChange('passportAvailable', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                Passport available
              </label>
              <FormField label="Passport Number" error={errors.passportNumber}>
                <input
                  type="text"
                  value={form.passportNumber}
                  onChange={(e) => handleChange('passportNumber', e.target.value)}
                  className={fieldClass(errors.passportNumber)}
                  disabled={!form.passportAvailable}
                  placeholder="Enter passport number"
                />
              </FormField>
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-sm text-slate-500">
                <p className="font-medium text-slate-700">Document checklist</p>
                <p className="mt-1 text-xs leading-relaxed">
                  Mark passport details above. Transcripts, SOP, and LOR uploads can be added in a later documents module.
                </p>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Follow-up Date" error={errors.followupDate}>
                  <input type="date" value={form.followupDate} onChange={(e) => handleChange('followupDate', e.target.value)} className={fieldClass(errors.followupDate)} />
                </FormField>
                <FormField label="Follow-up Type">
                  <select value={form.followupType} onChange={(e) => handleChange('followupType', e.target.value)} className={fieldClass(false)}>
                    {FOLLOWUP_TYPES.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <FormField label="Follow-up Status">
                <select value={form.followupStatus} onChange={(e) => handleChange('followupStatus', e.target.value)} className={fieldClass(false)}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FormField>
              <FormField label="Follow-up Remarks">
                <textarea rows={3} value={form.followupRemarks} onChange={(e) => handleChange('followupRemarks', e.target.value)} className={`${fieldClass(false)} resize-none`} placeholder="What should be discussed next?" />
              </FormField>
            </>
          )}
        </div>

        {submitError && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={goBack} disabled={submitting} className="max-md:min-h-11 max-md:w-full">
                Back
              </Button>
            )}
            {!isLastStep ? (
              <Button type="button" onClick={goNext} className="max-md:min-h-11 max-md:w-full">
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={submitting} className="max-md:min-h-11 max-md:w-full">
                {submitting ? 'Saving...' : 'Save Student'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
