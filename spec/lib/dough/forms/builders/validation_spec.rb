require 'spec_helper'

module Dough
  module Forms
    module Builders
      describe Validation do
        class ValidationBuilderModel
          include ActiveModel::Validations

          attr_accessor :field_one, :field_two
        end

        def tidy_markup(markup)
          markup.gsub("\n", "")
                .gsub(/\>\s*\</,"><")
                .gsub(/\>\s*/, ">")
                .gsub(/\s*\<\//, "</") if markup
        end

        let(:model) do
          model = ValidationBuilderModel.new
          model.class_eval do
            validates :field_one, numericality: true
          end
          model.valid?
          model.errors[:base] << "base error A"
          model.errors[:field_one] << "field_one error 1"
          model.errors[:field_one] << "field_one error 2"
          model.errors[:field_two] << "field_two error 1"
          model
        end

        subject(:form_builder) { described_class.new(:model, model, {}, {}) }

        describe '#error_count' do
          it 'returns number of errors' do
            expect(form_builder.error_count).to eql(5)
          end
        end

        describe '#validation_summary' do
          context 'when there are no errors' do
            it 'does not render an empty div' do
              model.errors.clear
              expect(tidy_markup(form_builder.validation_summary)).to be_nil
            end
          end

          it 'renders the title' do
            expect(tidy_markup(form_builder.validation_summary)).to include(I18n.t('dough.forms.validation.summary.title', locale: :en))
          end

          context 'when welsh' do
            it 'renders the welsh title' do
              I18n.with_locale :cy do
                expect(tidy_markup(form_builder.validation_summary)).to include(I18n.t('dough.forms.validation.summary.title', locale: :cy))
              end
            end
          end

          context 'with a custom i18n message' do
            it 'returns custom message' do
              I18n.with_locale :test_custom_error do
                expect(tidy_markup(form_builder.validation_summary)).to_not include('is not a number')
                expect(tidy_markup(form_builder.validation_summary)).to_not include('Field one custom not a number error')
                expect(tidy_markup(form_builder.validation_summary)).to include('custom not a number error')
              end
            end
          end

          it 'lists all errors for the object' do
            model.errors.each do |field, error|
              expect(tidy_markup(form_builder.validation_summary)).to include(error)
            end
            expect(tidy_markup(form_builder.validation_summary)).to include('Field one is not a number')
          end

          context "when model implements field order" do
            it 'lists errors in order' do
              allow(model).to receive(:field_order).and_return([:field_two, :field_one])

              expected_match = ".*"
              model.field_order.each do |field|
                model.errors[field].each do |error|
                  expected_match += error + ".*"
                end
              end

              expect(tidy_markup(subject.validation_summary)).to match(expected_match)
            end
          end
        end

        describe '#errors_for' do
          it 'lists all errors for the field' do
            [:field_one, :field_two].each do |field|
              model.errors[field].each do |error|
                expect(tidy_markup(form_builder.errors_for(model, field))).to include(error)
              end
            end
          end

          it 'uses the form model by default' do
            [:field_one, :field_two].each do |field|
              model.errors[field].each do |error|
                expect(tidy_markup(form_builder.errors_for(field))).to include(error)
              end
            end
          end
        end

        context "when there are multiple objects" do
          let(:another_model) do
            model = ValidationBuilderModel.new
            model.errors[:field_a] << "field_a error a"
            model.errors[:field_a] << "field_a error b"
            model.errors[:field_b] << "field_b error a"
            model
          end

          describe '#validation_summary' do
            before :each do
              form_builder.validates(model, another_model)
            end

            it 'lists all errors for the objects' do
              [model, another_model].each do |m|
                m.errors.each do |field, error|
                  expect(tidy_markup(form_builder.validation_summary)).to include(error)
                end
              end
            end
          end
        end
      end
    end
  end
end
