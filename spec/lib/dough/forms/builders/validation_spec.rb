require 'spec_helper'

module Dough
  module Forms
    module Builders
      describe Validation do
        class ValidationBuilderModel
          include ActiveModel::Validations
        end

        def tidy_markup(markup)
          markup.gsub("\n", "")
                .gsub(/\>\s*\</,"><")
                .gsub(/\>\s*/, ">")
                .gsub(/\s*\<\//, "</") if markup
        end

        let(:model) do
          model = ValidationBuilderModel.new
          model.errors[:base] << "base error A"
          model.errors[:field_one] << "field_one error 1"
          model.errors[:field_one] << "field_one error 2"
          model.errors[:field_two] << "field_two error 1"
          model
        end

        subject(:form_builder) { described_class.new(:model, model, nil, {}, {}) }

        describe '#error_count' do
          it 'returns number of errors' do
            expect(form_builder.error_count).to eql(4)
          end
        end

        describe '#validation_summary' do
          context 'when there are no errors' do
            it 'does not render an empty div' do
              model.errors.clear
              expect(tidy_markup(form_builder.validation_summary)).to be_nil
            end
          end

          it 'lists all errors for the object' do
            model.errors.each do |field, error|
              expect(tidy_markup(form_builder.validation_summary)).to include(error)
            end
          end

          context "when model implements field order" do
            it 'lists errors in order' do
              model.stub(:field_order){ [:field_two, :field_one] }

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
