require 'spec_helper'

RSpec.describe Dough::Forms::Builder do
  class CustomModel
    include ActiveModel::Validations

    attr_accessor :name, :age
    validates :name, presence: true
    validates :age, presence: true, numericality: true
  end

  subject(:builder) { described_class.new(:model, model, {}, {}) }
  let(:valid_model) do
    CustomModel.new.tap do |object|
      object.name = 'My real name'
      object.age = 27
      object.valid?
    end
  end

  let(:invalid_model) do
    CustomModel.new.tap do |object|
      object.name = nil
      object.age = nil
      object.valid?
    end
  end

  describe '#errors_summary' do
    subject(:errors_summary) { builder.errors_summary }

    context 'when form is invalid' do
      let(:model) { invalid_model }

      it 'displays summary title' do
        expect(errors_summary).to include(
          I18n.t('dough.forms.validation.summary.title', locale: :en)
        )
      end

      it 'displays the error message' do
        expect(errors_summary).to include("Name can't be blank")
      end

      it 'renders a link to the field error' do
        expect(errors_summary).to include('<a href="#error-model-1">')
        expect(errors_summary).to include('<a href="#error-model-2">')
        expect(errors_summary).to include('<a href="#error-model-3">')
      end
    end

    context 'when is valid' do
      let(:model) { valid_model }

      it 'returns empty summary' do
        expect(errors_summary).to be_nil
      end
    end
  end

  describe '#errors_summary_partial_name' do
    let(:model) { invalid_model }

    it 'returns the name of the partial' do
      expect(subject.errors_summary_partial_name).to eq('errors_summary')
    end
  end

  describe '#errors_for' do
    subject(:inline_error) { builder.errors_for(:name) }

    context 'when is valid' do
      let(:model) { valid_model }

      it 'returns no error messages' do
        expect(inline_error).to be_nil
      end
    end

    context 'when form is invalid' do
      let(:model) { invalid_model }

      it 'displays the error message' do
        expect(inline_error).to include("Name can't be blank")
      end

      it 'displays the error messages with a numerical prefix' do
        expect(inline_error).to include("1. Name can't be blank")
      end

      it 'creates a uniques id' do
        expect(inline_error).to include('id="error-model-1"')
      end
    end
  end

  describe '#errors_for_partial_name' do
    let(:model) { invalid_model }

    it 'returns the name of the partial' do
      expect(subject.errors_for_partial_name).to eq('errors_for')
    end
  end

  describe '#object_errors' do
    context 'when is valid' do
      let(:model) { valid_model }

      it 'returns empty errors' do
        expect(builder.object_errors).to eq([])
      end
    end

    context 'when form is invalid' do
      let(:model) { invalid_model }

      it 'returns object errors with a counter' do
        expect(builder.object_errors).to eq([
          ::Dough::Forms::ObjectError.new(object: model, field_name: :name, message: "can't be blank", counter: 1),
          ::Dough::Forms::ObjectError.new(object: model, field_name: :age, message: "can't be blank", counter: 2),
          ::Dough::Forms::ObjectError.new(object: model, field_name: :age, message: "is not a number", counter: 3),
        ])
      end
    end
  end
end
