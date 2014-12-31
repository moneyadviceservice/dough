require 'spec_helper'

describe Dough::Forms::Builders::Validation do
  class Dough::Forms::Builders::ValidationBuilderModel
    include ActiveModel::Validations

    attr_accessor :field_one, :field_two
  end

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

  subject(:form_builder) { described_class.new(:model, model, {}, {}) }

  describe '#error_count' do
    it 'returns number of errors' do
      expect(subject.error_count).to eql(5)
    end
  end

  describe '#validation_summary' do

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
        expect(subject.validation_summary).to include('validation-summary--hidden')
      end
    end

    it 'renders the title' do
      expect(subject.validation_summary).to include(
        I18n.t('dough.forms.validation.summary.title', locale: :en)
      )
    end

    context 'when welsh' do
      it 'renders the welsh title' do
        I18n.with_locale :cy do
          expect(subject.validation_summary).to include(
            I18n.t('dough.forms.validation.summary.title', locale: :cy)
          )
        end
      end
    end

    context 'with a custom i18n message' do
      it 'returns custom message' do
        I18n.with_locale :test_custom_error do
          expect(subject.validation_summary).to_not include('is not a number')
          expect(subject.validation_summary).to_not include('Field one custom not a number error')
          expect(subject.validation_summary).to     include('custom not a number error')
        end
      end
    end

    it 'lists all errors for the object' do
      model.errors.each do |_field, error|
        expect(subject.validation_summary).to include(error)
      end

      expect(subject.validation_summary).to include('Field one is not a number')
    end

    context 'lists errors in order' do
      #FIXME: Don't like having to call a private method to have to verify list order
      let(:errors) { subject.send(:errors) }

      before :each do
        allow(model).to receive(:field_order).and_return([:field_two, :field_one])
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
      [:field_one, :field_two].each do |field|
        model.errors[field].each do |error|
          expect(subject.errors_for(model, field)).to include(error)
        end
      end
    end

    it 'uses the form model by default' do
      [:field_one, :field_two].each do |field|
        model.errors[field].each do |error|
          expect(subject.errors_for(field)).to include(error)
        end
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
      before :each do
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
