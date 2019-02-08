require 'spec_helper'

describe Dough::Forms::Builders::Validation do
  class Dough::Forms::Builders::ValidationBuilderModel
    include ActiveModel::Validations

    attr_accessor :field_one, :field_two
  end

  subject(:form_builder) { described_class.new(:model, model, {}, {}) }

  let(:model) do
    Dough::Forms::Builders::ValidationBuilderModel.new.tap do |m|
      m.class_eval do
        validates :field_one, numericality: true
      end
      m.valid?
      m.errors[:base] << 'base error A'
      m.errors[:field_one] << 'field_one error 1'
      m.errors[:field_one] << 'field_one error 2'
      m.errors[:field_two] << 'field_two error 1'
    end
  end

  describe '#view_renderer' do
    it 'do not raise exception' do
      expect { form_builder.view_renderer }.not_to raise_exception
    end
  end

  describe '#error_count' do
    it 'returns number of errors' do
      expect(subject.error_count).to be(5)
    end
  end

  describe '#validation_summary' do
    subject(:validation_summary) { form_builder.validation_summary }

    context 'when there are no errors' do
      let(:model) do
        Dough::Forms::Builders::ValidationBuilderModel.new.tap do |m|
          m.class_eval do
            validates :field_one, numericality: true
          end
          m.field_one = 1
          m.valid?
        end
      end

      it 'renders a hidden summary' do
        expect(validation_summary).to include('validation-summary--hidden')
      end
    end

    it 'renders the title' do
      expect(validation_summary).to include(
        I18n.t('dough.forms.validation.summary.title', locale: :en)
      )
    end

    context 'when welsh' do
      it 'renders the welsh title' do
        I18n.with_locale :cy do
          expect(validation_summary).to include(
            I18n.t('dough.forms.validation.summary.title', locale: :cy)
          )
        end
      end
    end

    context 'with a custom i18n message' do
      it 'returns custom message' do
        I18n.with_locale :test_custom_error do
          expect(validation_summary).not_to include('is not a number')
          expect(validation_summary).to     include('custom not a number error')
        end
      end
    end

    it 'lists all errors for the object' do
      model.errors.each do |_field, error|
        expect(validation_summary).to include(error)
      end

      expect(validation_summary).to include('Field one is not a number')
    end

    context 'when form has an ID' do
      subject(:form_builder) { described_class.new(:model, model, {}, html: { id: 'form_id' }) }

      it 'uses the form id to generate the error links' do
        expect(validation_summary).to include('#error-form_id-1')
      end
    end

    context 'when form has no ID' do
      it 'uses the model name to generate the error links' do
        expect(validation_summary).to include('#error-model-1')
      end
    end

    context 'lists errors in order' do
      # FIXME: Don't like having to call a private method to have to verify list order
      let(:errors) { form_builder.send(:errors) }

      before do
        allow(model).to receive(:field_order).and_return(%i[field_two field_one])
      end

      it 'field_two should be the first error' do
        actual = errors.find { |error| error[:number] == 1 }
        expect(actual).to include(field: :field_two)
      end

      it 'field_one should be the second error' do
        actual = errors.find { |error| error[:number] == 2 }
        expect(actual).to include(field: :field_one)
      end
    end
  end

  describe '#errors_for' do
    it 'lists all errors for the field' do
      %i[field_one field_two].each do |field|
        model.errors[field].each do |error|
          expect(subject.errors_for(model, field)).to include(error)
        end
      end
    end

    it 'uses the form model by default' do
      %i[field_one field_two].each do |field|
        model.errors[field].each do |error|
          expect(subject.errors_for(field)).to include(error)
        end
      end
    end

    context 'when form has an ID' do
      subject(:form_builder) { described_class.new(:model, model, {}, html: { id: 'form_id' }) }

      it 'uses the form ID to generate the error id' do
        expect(subject.errors_for(:field_one)).to include('error-form_id-1')
      end
    end

    context 'when form has no ID' do
      it 'uses the model name to generate the error id' do
        expect(subject.errors_for(:field_one)).to include('error-model-1')
      end
    end
  end

  context 'when there are multiple objects' do
    let(:another_model) do
      Dough::Forms::Builders::ValidationBuilderModel.new.tap do |m|
        m.errors[:field_a] << 'field_a error a'
        m.errors[:field_a] << 'field_a error b'
        m.errors[:field_b] << 'field_b error a'
      end
    end

    describe '#validation_summary' do
      before do
        subject.validates(model, another_model)
      end

      it 'lists all errors for the objects' do
        [model, another_model].each do |m|
          m.errors.each do |_field, error|
            expect(subject.validation_summary).to include(error)
          end
        end
      end
    end
  end
end
