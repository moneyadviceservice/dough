require 'spec_helper'

module Dough
  module Forms
    module Builders
      describe Validation do
        class ValidationBuilderModel
          include ActiveModel::Validations
        end

        def tidy_markup(markup)
          markup.gsub("\n", "").gsub(/\>\s*\</,"><").gsub(/\>\s*/, ">").gsub(/\s*\<\//, "</")
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
          it 'lists all errors for the object' do
            expect(tidy_markup(form_builder.validation_summary)).to eql("<div class=\"validation-summary\"><div class=\"validation-summary__content-container\"><ul class=\"validation-summary__list\"><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">1</span>base error A</li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">2</span><a href=\"#field_one-errors\">Field one field_one error 1</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">3</span><a href=\"#field_one-errors\">Field one field_one error 2</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">4</span><a href=\"#field_two-errors\">Field two field_two error 1</a></li></ul></div></div>")
          end

          context "when model implements field order" do
            it 'lists errors in order' do
              model.stub(:field_order).and_return{ [:field_two, :field_one] }

              expect(tidy_markup(subject.validation_summary)).to eql("<div class=\"validation-summary\"><div class=\"validation-summary__content-container\"><ul class=\"validation-summary__list\"><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">1</span><a href=\"#field_two-errors\">Field two field_two error 1</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">2</span><a href=\"#field_one-errors\">Field one field_one error 1</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">3</span><a href=\"#field_one-errors\">Field one field_one error 2</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">4</span>base error A</li></ul></div></div>")
            end
          end
        end

        describe '#errors_for' do
          it 'lists all errors for the field' do
            expect(tidy_markup(form_builder.errors_for(model, :field_one))).to eql("<ul id=\"field_one-errors\"><li>2. Field one field_one error 1</li><li>3. Field one field_one error 2</li></ul>")

            expect(tidy_markup(form_builder.errors_for(model, :field_two))).to eql("<ul id=\"field_two-errors\"><li>4. Field two field_two error 1</li></ul>")
          end

          it 'uses the form model by default' do
            expect(tidy_markup(form_builder.errors_for(:field_one))).to eql("<ul id=\"field_one-errors\"><li>2. Field one field_one error 1</li><li>3. Field one field_one error 2</li></ul>")
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
              form_builder.validates model, another_model
            end

            it 'lists all errors for the objects' do
              expect(tidy_markup(form_builder.validation_summary)).to eql("<div class=\"validation-summary\"><div class=\"validation-summary__content-container\"><ul class=\"validation-summary__list\"><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">1</span>base error A</li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">2</span><a href=\"#field_one-errors\">Field one field_one error 1</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">3</span><a href=\"#field_one-errors\">Field one field_one error 2</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">4</span><a href=\"#field_two-errors\">Field two field_two error 1</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">5</span><a href=\"#field_a-errors\">Field a field_a error a</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">6</span><a href=\"#field_a-errors\">Field a field_a error b</a></li><li class=\"validation-summary__error\"><span class=\"validation-summary__error-number\">7</span><a href=\"#field_b-errors\">Field b field_b error a</a></li></ul></div></div>")
            end
          end
        end
      end
    end
  end
end
